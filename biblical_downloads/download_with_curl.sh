#!/bin/bash
# Download Nag Hammadi with curl

mkdir -p logos_corpora/nag_hammadi
cd logos_corpora/nag_hammadi

UA="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"

echo "Downloading Nag Hammadi Library..."

curl -s -A "$UA" -k "https://gnosis.org/naghamm/gthlamb.html" -o gospel_thomas.html
curl -s -A "$UA" -k "https://gnosis.org/naghamm/gop.html" -o gospel_philip.html
curl -s -A "$UA" -k "https://gnosis.org/naghamm/apocjn-long.html" -o apocryphon_john.html
curl -s -A "$UA" -k "https://gnosis.org/naghamm/got.html" -o gospel_truth.html
curl -s -A "$UA" -k "https://gnosis.org/naghamm/jam.html" -o apocryphon_james.html
curl -s -A "$UA" -k "https://gnosis.org/naghamm/hypostas.html" -o hypostasis_archons.html
curl -s -A "$UA" -k "https://gnosis.org/naghamm/origin.html" -o origin_world.html
curl -s -A "$UA" -k "https://gnosis.org/naghamm/exe.html" -o exegesis_soul.html
curl -s -A "$UA" -k "https://gnosis.org/naghamm/bookt.html" -o book_thomas.html
curl -s -A "$UA" -k "https://gnosis.org/naghamm/egygos.html" -o gospel_egyptians.html
curl -s -A "$UA" -k "https://gnosis.org/naghamm/eugn.html" -o eugnostos.html
curl -s -A "$UA" -k "https://gnosis.org/naghamm/sjc.html" -o sophia_jesus_christ.html
curl -s -A "$UA" -k "https://gnosis.org/naghamm/dialog.html" -o dialogue_savior.html
curl -s -A "$UA" -k "https://gnosis.org/naghamm/thunder.html" -o thunder_perfect_mind.html
curl -s -A "$UA" -k "https://gnosis.org/naghamm/autho.html" -o authoritative_teaching.html
curl -s -A "$UA" -k "https://gnosis.org/naghamm/2seth.html" -o second_treatise_seth.html
curl -s -A "$UA" -k "https://gnosis.org/naghamm/apocpet.html" -o apocalypse_peter.html
curl -s -A "$UA" -k "https://gnosis.org/naghamm/silvanus.html" -o teachings_silvanus.html
curl -s -A "$UA" -k "https://gnosis.org/naghamm/3steles.html" -o three_steles_seth.html
curl -s -A "$UA" -k "https://gnosis.org/naghamm/zost.html" -o zostrianos.html
curl -s -A "$UA" -k "https://gnosis.org/naghamm/peter-phil.html" -o letter_peter_philip.html
curl -s -A "$UA" -k "https://gnosis.org/naghamm/melchiz.html" -o melchizedek.html
curl -s -A "$UA" -k "https://gnosis.org/naghamm/norea.html" -o thought_norea.html
curl -s -A "$UA" -k "https://gnosis.org/naghamm/testim.html" -o testimony_truth.html
curl -s -A "$UA" -k "https://gnosis.org/naghamm/trimorph.html" -o trimorphic_protennoia.html
curl -s -A "$UA" -k "https://gnosis.org/naghamm/pap.html" -o prayer_apostle_paul.html
curl -s -A "$UA" -k "https://gnosis.org/naghamm/res.html" -o treatise_resurrection.html
curl -s -A "$UA" -k "https://gnosis.org/naghamm/tripart.html" -o tripartite_tractate.html
curl -s -A "$UA" -k "https://gnosis.org/naghamm/apocpaul.html" -o apocalypse_paul.html
curl -s -A "$UA" -k "https://gnosis.org/naghamm/1ja.html" -o first_apocalypse_james.html
curl -s -A "$UA" -k "https://gnosis.org/naghamm/2ja.html" -o second_apocalypse_james.html
curl -s -A "$UA" -k "https://gnosis.org/naghamm/adam.html" -o apocalypse_adam.html
curl -s -A "$UA" -k "https://gnosis.org/naghamm/actpet12.html" -o acts_peter_twelve.html
curl -s -A "$UA" -k "https://gnosis.org/naghamm/parashem.html" -o paraphrase_shem.html
curl -s -A "$UA" -k "https://gnosis.org/naghamm/allog.html" -o allogenes.html
curl -s -A "$UA" -k "https://gnosis.org/naghamm/marsanes.html" -o marsanes.html
curl -s -A "$UA" -k "https://gnosis.org/naghamm/intknow.html" -o interpretation_knowledge.html
curl -s -A "$UA" -k "https://gnosis.org/naghamm/valexp.html" -o valentinian_exposition.html

echo "Downloading Other Gnostic..."
mkdir -p ../other_gnostic
cd ../other_gnostic
curl -s -A "$UA" -k "https://gnosis.org/library/marygosp.htm" -o gospel_mary.html
curl -s -A "$UA" -k "https://gnosis.org/library/judas.htm" -o gospel_judas.html
curl -s -A "$UA" -k "https://gnosis.org/library/hymnpearl.htm" -o hymn_pearl.html
curl -s -A "$UA" -k "https://gnosis.org/library/hermes1.htm" -o poimandres.html

echo "Done!"
ls -la ../nag_hammadi/*.html | wc -l
ls -la ../other_gnostic/*.html | wc -l
