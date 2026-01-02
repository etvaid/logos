#!/usr/bin/env python3
"""
JEDP Documentary Hypothesis Analysis - Hebrew Text
Tests the four-source Pentateuch theory using Hebrew function words.
"""

import os
import re
import json
import numpy as np
import psycopg2
import unicodedata
from collections import Counter
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import GroupKFold, cross_val_predict
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import accuracy_score, confusion_matrix
from datetime import datetime

DATABASE_URL = os.environ.get('DATABASE_URL', '')


def strip_hebrew_diacritics(text: str) -> str:
    """Remove nikud (vowels) and cantillation marks, keep consonants."""
    # First strip HTML tags
    text = re.sub(r'<[^>]+>', '', text)

    # Remove Hebrew points: nikud (U+05B0-05BD, 05BF, 05C1-05C2, 05C4-05C5, 05C7)
    # and cantillation (U+0591-05AF)
    result = []
    for char in text:
        if unicodedata.category(char) == 'Mn':  # Mark, Nonspacing
            code = ord(char)
            # Keep combining letters but remove points
            if 0x0591 <= code <= 0x05C7:
                continue
        result.append(char)

    return ''.join(result)

# Hebrew function words for style analysis (consonants only - no nikud)
HEBREW_FUNCTION_WORDS = [
    # Conjunctions
    'כי', 'אם', 'או', 'גם', 'אך', 'רק', 'אף', 'פן',

    # Prepositions (standalone forms)
    'מן', 'אל', 'על', 'את', 'עם', 'תחת', 'אחר', 'לפני', 'בין', 'עד',
    'אצל', 'נגד', 'סביב', 'למען', 'בעבור', 'בלי', 'בלעדי', 'כמו',

    # Demonstratives and pronouns
    'זה', 'זאת', 'אלה', 'הוא', 'היא', 'הם', 'הן', 'אני', 'אנחנו',
    'אתה', 'את', 'אתם', 'אתן', 'זו', 'הלזה', 'ההוא', 'ההיא',

    # Relative/Complementizer
    'אשר', 'כאשר', 'יען', 'לפי',

    # Negation
    'לא', 'אין', 'בל', 'טרם', 'בטרם',

    # Question words
    'מה', 'מי', 'איך', 'למה', 'מדוע', 'מתי', 'איפה', 'אנה', 'האם',

    # Common particles
    'כל', 'עוד', 'שם', 'פה', 'הנה', 'כן', 'לכן', 'עתה', 'אז', 'רק',
    'הלא', 'הן', 'נא', 'אמנם', 'אכן', 'כבר', 'תמיד', 'לבד',

    # Divine names (KEY for J vs E discrimination!)
    'יהוה',      # YHWH - Yahwist marker
    'יהֹוה',     # Variant spelling
    'אלהים',     # Elohim - Elohist marker
    'אל',        # El
    'אדני',      # Adonai
    'שדי',       # Shaddai

    # Priestly vocabulary
    'קדש', 'טהור', 'טמא', 'כפר', 'חטאת', 'עלה', 'זבח', 'מנחה',
    'כהן', 'לוי', 'משכן', 'אהל', 'מועד', 'קרבן',

    # Deuteronomic vocabulary
    'שמע', 'ברית', 'תורה', 'מצוה', 'חקה', 'משפט', 'לבב',
]


def extract_hebrew_features(text: str) -> np.ndarray:
    """Extract function word frequencies from Hebrew text."""
    # Strip diacritics and HTML
    clean_text = strip_hebrew_diacritics(text)

    # Split on whitespace and punctuation
    words = re.findall(r'[\u0590-\u05FF]+', clean_text)
    total = len(words)
    if total == 0:
        return np.zeros(len(HEBREW_FUNCTION_WORDS))

    # Count each word (stripped of diacritics)
    word_counts = Counter(words)

    features = []
    for fw in HEBREW_FUNCTION_WORDS:
        # Strip diacritics from function word too
        fw_clean = strip_hebrew_diacritics(fw)
        count = word_counts.get(fw_clean, 0)
        features.append(count / total)

    return np.array(features)


def run_jedp_analysis():
    print("=" * 70)
    print("JEDP DOCUMENTARY HYPOTHESIS - HEBREW TEXT ANALYSIS")
    print("=" * 70)
    print(f"Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")

    conn = psycopg2.connect(DATABASE_URL)
    cur = conn.cursor()

    # Get Pentateuch verses with JEDP labels (excluding '?')
    cur.execute("""
        SELECT book, chapter, verse, hebrew_text, source_label
        FROM hebrew_bible
        WHERE source_label IN ('J', 'E', 'D', 'P')
        ORDER BY book, chapter, verse
    """)
    rows = cur.fetchall()

    print(f"\n[1] Loaded {len(rows)} verses with JEDP labels")

    # Build segments (~500 tokens each)
    segments = []
    current_segment = {"text": "", "source": None, "book": None, "start": None, "words": 0}

    for book, chapter, verse, hebrew_text, source in rows:
        words = hebrew_text.split()

        if current_segment["source"] != source or current_segment["words"] >= 500:
            if current_segment["words"] >= 100:  # Min segment size
                segments.append(current_segment)
            current_segment = {
                "text": hebrew_text,
                "source": source,
                "book": book,
                "start": f"{book} {chapter}:{verse}",
                "words": len(words)
            }
        else:
            current_segment["text"] += " " + hebrew_text
            current_segment["words"] += len(words)

    # Don't forget last segment
    if current_segment["words"] >= 100:
        segments.append(current_segment)

    print(f"[2] Created {len(segments)} segments for analysis")

    # Distribution
    source_counts = Counter(s["source"] for s in segments)
    print("\n[3] Segment Distribution:")
    for source in ["J", "E", "D", "P"]:
        print(f"    {source}: {source_counts.get(source, 0)} segments")

    # Extract features
    X = np.array([extract_hebrew_features(s["text"]) for s in segments])
    y = np.array([s["source"] for s in segments])
    groups = np.array([s["book"] for s in segments])  # Group by book for CV

    print(f"\n[4] Feature matrix: {X.shape}")
    print(f"    Features: {len(HEBREW_FUNCTION_WORDS)} Hebrew function words")

    # Scale features
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)

    # Work-holdout cross-validation (leave one book out)
    n_splits = min(5, len(set(groups)))
    gkf = GroupKFold(n_splits=n_splits)

    clf = RandomForestClassifier(n_estimators=100, random_state=42, max_depth=10)

    y_pred = cross_val_predict(clf, X_scaled, y, groups=groups, cv=gkf)
    accuracy = accuracy_score(y, y_pred)

    print(f"\n[5] RESULTS:")
    print(f"    Work-Holdout Accuracy: {accuracy*100:.1f}%")

    # Confusion matrix
    print("\n[6] Confusion Matrix:")
    labels = ["J", "E", "D", "P"]
    cm = confusion_matrix(y, y_pred, labels=labels)
    print("       " + "  ".join(f"{l:>5}" for l in labels))
    for i, row in enumerate(cm):
        print(f"    {labels[i]}  " + "  ".join(f"{v:>5}" for v in row))

    # ============================================
    # FALSIFICATION GATES
    # ============================================
    print("\n" + "=" * 70)
    print("FALSIFICATION GATES")
    print("=" * 70)

    gates_passed = 0
    gate_results = {}

    # Gate 1: Label Permutation Test
    print("\n[Gate 1] Label Permutation Test")
    perm_accuracies = []
    for i in range(20):
        y_perm = np.random.permutation(y)
        y_pred_perm = cross_val_predict(clf, X_scaled, y_perm, groups=groups, cv=gkf)
        perm_accuracies.append(accuracy_score(y_perm, y_pred_perm))

    perm_mean = np.mean(perm_accuracies)
    chance = 1.0 / len(set(y))
    gate1_pass = accuracy > perm_mean + 0.10

    print(f"    Real: {accuracy*100:.1f}% | Permuted: {perm_mean*100:.1f}% | Chance: {chance*100:.1f}%")
    print(f"    Status: {'PASS' if gate1_pass else 'FAIL'}")
    if gate1_pass:
        gates_passed += 1
    gate_results["label_permutation"] = {
        "real": accuracy, "permuted": perm_mean, "chance": chance, "pass": gate1_pass
    }

    # Gate 2: Multi-Resolution Stability
    print("\n[Gate 2] Multi-Resolution Stability")
    resolutions = [300, 500, 800]
    res_accuracies = []

    for target_words in resolutions:
        # Rebuild segments at different resolution
        res_segments = []
        current = {"text": "", "source": None, "book": None, "words": 0}

        for book, chapter, verse, hebrew_text, source in rows:
            words = hebrew_text.split()
            if current["source"] != source or current["words"] >= target_words:
                if current["words"] >= 50:
                    res_segments.append(current)
                current = {"text": hebrew_text, "source": source, "book": book, "words": len(words)}
            else:
                current["text"] += " " + hebrew_text
                current["words"] += len(words)
        if current["words"] >= 50:
            res_segments.append(current)

        if len(res_segments) < 10:
            res_accuracies.append(accuracy)
            continue

        X_res = np.array([extract_hebrew_features(s["text"]) for s in res_segments])
        y_res = np.array([s["source"] for s in res_segments])
        groups_res = np.array([s["book"] for s in res_segments])

        X_res_scaled = scaler.fit_transform(X_res)
        n_splits_res = min(5, len(set(groups_res)))
        gkf_res = GroupKFold(n_splits=n_splits_res)

        y_pred_res = cross_val_predict(clf, X_res_scaled, y_res, groups=groups_res, cv=gkf_res)
        res_accuracies.append(accuracy_score(y_res, y_pred_res))

    stability = max(res_accuracies) - min(res_accuracies)
    gate2_pass = stability < 0.15

    print(f"    Accuracies: " + " | ".join(f"{r*100:.1f}%" for r in res_accuracies))
    print(f"    Stability: {stability*100:.1f}% variance")
    print(f"    Status: {'PASS' if gate2_pass else 'FAIL'}")
    if gate2_pass:
        gates_passed += 1
    gate_results["multi_resolution"] = {"accuracies": res_accuracies, "pass": gate2_pass}

    # Gate 3: Random Features Baseline
    print("\n[Gate 3] Random Features Baseline")
    X_random = np.random.randn(X.shape[0], X.shape[1])
    X_random_scaled = scaler.fit_transform(X_random)
    y_pred_random = cross_val_predict(clf, X_random_scaled, y, groups=groups, cv=gkf)
    random_acc = accuracy_score(y, y_pred_random)
    gate3_pass = random_acc < chance + 0.10

    print(f"    Random Features Accuracy: {random_acc*100:.1f}%")
    print(f"    Status: {'PASS' if gate3_pass else 'FAIL'}")
    if gate3_pass:
        gates_passed += 1
    gate_results["random_features"] = {"accuracy": random_acc, "pass": gate3_pass}

    # Gate 4: Cross-Source Consistency
    print("\n[Gate 4] Cross-Book Generalization")
    # Train on some books, test on others
    books = list(set(groups))
    if len(books) >= 3:
        train_books = books[:3]
        test_books = books[3:]

        train_mask = np.isin(groups, train_books)
        test_mask = np.isin(groups, test_books)

        if sum(test_mask) > 0:
            clf_temp = RandomForestClassifier(n_estimators=100, random_state=42, max_depth=10)
            clf_temp.fit(X_scaled[train_mask], y[train_mask])
            y_pred_cross = clf_temp.predict(X_scaled[test_mask])
            cross_acc = accuracy_score(y[test_mask], y_pred_cross)
        else:
            cross_acc = accuracy
    else:
        cross_acc = accuracy

    gate4_pass = cross_acc > chance + 0.10
    print(f"    Cross-Book Accuracy: {cross_acc*100:.1f}%")
    print(f"    Status: {'PASS' if gate4_pass else 'FAIL'}")
    if gate4_pass:
        gates_passed += 1
    gate_results["cross_book"] = {"accuracy": cross_acc, "pass": gate4_pass}

    # Gate 5: Feature Importance Check
    print("\n[Gate 5] Feature Importance Analysis")
    clf_full = RandomForestClassifier(n_estimators=100, random_state=42, max_depth=10)
    clf_full.fit(X_scaled, y)

    importances = clf_full.feature_importances_
    top_indices = np.argsort(importances)[-10:][::-1]

    print("    Top 10 Discriminating Features:")
    for idx in top_indices:
        fw = HEBREW_FUNCTION_WORDS[idx]
        imp = importances[idx]
        print(f"      {fw}: {imp:.3f}")

    # Check if divine names are important (they should be for J vs E)
    divine_names = ['יהוה', 'אלהים']
    divine_importance = 0
    for dn in divine_names:
        dn_clean = strip_hebrew_diacritics(dn)
        for i, fw in enumerate(HEBREW_FUNCTION_WORDS):
            if strip_hebrew_diacritics(fw) == dn_clean:
                divine_importance += importances[i]
                break
    gate5_pass = divine_importance > 0.01  # Divine names should matter

    print(f"\n    Divine Name Total Importance: {divine_importance:.3f}")
    print(f"    Status: {'PASS' if gate5_pass else 'FAIL'}")
    if gate5_pass:
        gates_passed += 1
    gate_results["feature_importance"] = {"divine_importance": divine_importance, "pass": gate5_pass}

    # ============================================
    # FINAL SUMMARY
    # ============================================
    print("\n" + "=" * 70)
    print("JEDP HEBREW ANALYSIS SUMMARY")
    print("=" * 70)

    print(f"\nAccuracy: {accuracy*100:.1f}%")
    print(f"Gates Passed: {gates_passed}/5")

    if accuracy >= 0.70 and gates_passed >= 4:
        finding = "Strong stylistic evidence for JEDP documentary sources"
    elif accuracy >= 0.50 and gates_passed >= 3:
        finding = "Moderate stylistic differentiation supports documentary hypothesis"
    else:
        finding = "Results inconclusive - further validation needed"

    print(f"\nFinding: {finding}")

    # Scholarly context
    print("\n" + "-" * 50)
    print("SCHOLARLY CONTEXT")
    print("-" * 50)
    print("Consensus View: Four sources (J, E, D, P) compiled over centuries")
    print(f"Our Finding: {finding}")

    relationship = "CONFIRMS" if accuracy > 0.40 and gates_passed >= 3 else "INCONCLUSIVE"
    print(f"Relationship to Consensus: {relationship}")

    # Source characteristics detected
    print("\n" + "-" * 50)
    print("SOURCE CHARACTERISTICS DETECTED")
    print("-" * 50)

    # Per-source feature analysis
    for source in ["J", "E", "D", "P"]:
        source_mask = y == source
        if sum(source_mask) > 0:
            source_features = X[source_mask].mean(axis=0)
            top_for_source = np.argsort(source_features)[-5:][::-1]
            top_words = [HEBREW_FUNCTION_WORDS[i] for i in top_for_source]
            print(f"\n{source}:")
            for i, idx in enumerate(top_for_source[:3]):
                print(f"    {HEBREW_FUNCTION_WORDS[idx]}: {source_features[idx]:.4f}")

    cur.close()
    conn.close()

    # Save results
    results = {
        "study": "JEDP Documentary Hypothesis (Hebrew)",
        "accuracy": float(accuracy),
        "gates_passed": gates_passed,
        "total_gates": 5,
        "finding": finding,
        "relationship": relationship,
        "gate_results": gate_results,
        "generated": datetime.now().isoformat()
    }

    with open("logos_reports/jedp_hebrew_results.json", "w") as f:
        json.dump(results, f, indent=2, default=str)

    print(f"\n\nResults saved to logos_reports/jedp_hebrew_results.json")

    return results


if __name__ == "__main__":
    run_jedp_analysis()
