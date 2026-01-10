'use client';

import { useState } from 'react';
import PageContainer from '@/components/layout/PageContainer';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, AreaChart, Area } from 'recharts';

// Sample synoptic data
const synopticPassages = [
  {
    id: 1,
    qReference: 'Q 3:7-9',
    title: 'John\'s Preaching',
    matthewRef: 'Matt 3:7-10',
    lukeRef: 'Luke 3:7-9',
    markRef: null,
    traditionType: 'double_mt_lk',
    confidence: 0.87,
    matthewText: 'γεννήματα ἐχιδνῶν, τίς ὑπέδειξεν ὑμῖν φυγεῖν ἀπὸ τῆς μελλούσης ὀργῆς;',
    lukeText: 'γεννήματα ἐχιδνῶν, τίς ὑπέδειξεν ὑμῖν φυγεῖν ἀπὸ τῆς μελλούσης ὀργῆς;',
    reconstructedQ: 'γεννήματα ἐχιδνῶν, τίς ὑπέδειξεν ὑμῖν φυγεῖν ἀπὸ τῆς μελλούσης ὀργῆς;',
    similarity: 0.95,
    doctrinalProfile: { christology: -0.2, eschatology: 0.8, ethics: 0.6 }
  },
  {
    id: 2,
    qReference: 'Q 4:1-13',
    title: 'Temptation of Jesus',
    matthewRef: 'Matt 4:1-11',
    lukeRef: 'Luke 4:1-13',
    markRef: 'Mark 1:12-13',
    traditionType: 'triple',
    confidence: 0.72,
    matthewText: 'Τότε ὁ Ἰησοῦς ἀνήχθη εἰς τὴν ἔρημον ὑπὸ τοῦ πνεύματος...',
    lukeText: 'Ἰησοῦς δὲ πλήρης πνεύματος ἁγίου ὑπέστρεψεν ἀπὸ τοῦ Ἰορδάνου...',
    markText: 'Καὶ εὐθὺς τὸ πνεῦμα αὐτὸν ἐκβάλλει εἰς τὴν ἔρημον.',
    similarity: 0.68,
    doctrinalProfile: { christology: 0.3, eschatology: 0.2, ethics: 0.4 }
  },
  {
    id: 3,
    qReference: 'Q 6:20-23',
    title: 'Beatitudes',
    matthewRef: 'Matt 5:3-12',
    lukeRef: 'Luke 6:20-23',
    markRef: null,
    traditionType: 'double_mt_lk',
    confidence: 0.81,
    matthewText: 'Μακάριοι οἱ πτωχοὶ τῷ πνεύματι, ὅτι αὐτῶν ἐστιν ἡ βασιλεία τῶν οὐρανῶν.',
    lukeText: 'Μακάριοι οἱ πτωχοί, ὅτι ὑμετέρα ἐστὶν ἡ βασιλεία τοῦ θεοῦ.',
    reconstructedQ: 'Μακάριοι οἱ πτωχοί, ὅτι ὑμετέρα ἐστὶν ἡ βασιλεία τοῦ θεοῦ.',
    similarity: 0.75,
    doctrinalProfile: { christology: 0.1, eschatology: 0.7, ethics: 0.9 }
  },
  {
    id: 4,
    qReference: 'Q 7:1-10',
    title: 'Centurion\'s Servant',
    matthewRef: 'Matt 8:5-13',
    lukeRef: 'Luke 7:1-10',
    markRef: null,
    traditionType: 'double_mt_lk',
    confidence: 0.78,
    matthewText: 'Εἰσελθόντος δὲ αὐτοῦ εἰς Καφαρναούμ...',
    lukeText: 'Ἐπειδὴ ἐπλήρωσεν πάντα τὰ ῥήματα αὐτοῦ...',
    reconstructedQ: 'Core Q text reconstructed with moderate confidence',
    similarity: 0.65,
    doctrinalProfile: { christology: 0.5, eschatology: 0.3, ethics: 0.6 }
  },
  {
    id: 5,
    qReference: 'Q 11:2-4',
    title: 'Lord\'s Prayer',
    matthewRef: 'Matt 6:9-13',
    lukeRef: 'Luke 11:2-4',
    markRef: null,
    traditionType: 'double_mt_lk',
    confidence: 0.85,
    matthewText: 'Πάτερ ἡμῶν ὁ ἐν τοῖς οὐρανοῖς, ἁγιασθήτω τὸ ὄνομά σου...',
    lukeText: 'Πάτερ, ἁγιασθήτω τὸ ὄνομά σου, ἐλθέτω ἡ βασιλεία σου...',
    reconstructedQ: 'Πάτερ, ἁγιασθήτω τὸ ὄνομά σου, ἐλθέτω ἡ βασιλεία σου...',
    similarity: 0.82,
    doctrinalProfile: { christology: 0.4, eschatology: 0.8, ethics: 0.7 }
  }
];

// Redaction patterns
const matthewPatterns = [
  { pattern: 'Kingdom of Heaven', frequency: 32, type: 'addition', doctrinal: 'Jewish sensitivity' },
  { pattern: 'Fulfillment citations', frequency: 11, type: 'addition', doctrinal: 'Christology' },
  { pattern: 'Church terminology', frequency: 3, type: 'addition', doctrinal: 'Ecclesiology' },
  { pattern: 'Extended ethical teaching', frequency: 8, type: 'expansion', doctrinal: 'Ethics' },
];

const lukePatterns = [
  { pattern: 'Poor and marginalized', frequency: 15, type: 'emphasis', doctrinal: 'Social justice' },
  { pattern: 'Prayer emphasis', frequency: 9, type: 'expansion', doctrinal: 'Spirituality' },
  { pattern: 'Gentile inclusion', frequency: 7, type: 'addition', doctrinal: 'Universalism' },
  { pattern: 'Historical framing', frequency: 6, type: 'addition', doctrinal: 'Apologetics' },
];

// Doctrinal profile data for Q
const doctrinalAxes = [
  { axis: 'Christology', value: 0.35, fullMark: 1 },
  { axis: 'Eschatology', value: 0.75, fullMark: 1 },
  { axis: 'Ethics', value: 0.85, fullMark: 1 },
  { axis: 'Soteriology', value: 0.45, fullMark: 1 },
  { axis: 'Pneumatology', value: 0.55, fullMark: 1 },
];

// Tradition distribution
const traditionDistribution = [
  { name: 'Triple (Mt+Mk+Lk)', value: 350, color: '#C9A962' },
  { name: 'Double Mt+Lk (Q)', value: 235, color: '#8B7355' },
  { name: 'Double Mt+Mk', value: 45, color: '#6B8E6B' },
  { name: 'Double Mk+Lk', value: 28, color: '#7B68A0' },
];

export default function SynopticPage() {
  const [selectedPassage, setSelectedPassage] = useState(synopticPassages[0]);
  const [activeTab, setActiveTab] = useState<'alignment' | 'reconstruction' | 'analysis'>('alignment');
  const [showReconstruction, setShowReconstruction] = useState(false);

  return (
    <PageContainer
      title="Synoptic Analysis"
      subtitle="Q Source Reconstruction and Gospel Comparison"
    >
      <div className="space-y-8">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-[#1A1A1D] border border-[#C9A962]/20 rounded-lg p-6">
            <div className="text-3xl font-bold text-[#C9A962]">235</div>
            <div className="text-[#F5F3EF]/70 mt-1">Q Passages</div>
            <div className="text-xs text-[#F5F3EF]/50 mt-2">Double tradition (Mt+Lk)</div>
          </div>
          <div className="bg-[#1A1A1D] border border-[#C9A962]/20 rounded-lg p-6">
            <div className="text-3xl font-bold text-[#8B7355]">658</div>
            <div className="text-[#F5F3EF]/70 mt-1">Synoptic Alignments</div>
            <div className="text-xs text-[#F5F3EF]/50 mt-2">All parallel passages</div>
          </div>
          <div className="bg-[#1A1A1D] border border-[#C9A962]/20 rounded-lg p-6">
            <div className="text-3xl font-bold text-[#6B8E6B]">47</div>
            <div className="text-[#F5F3EF]/70 mt-1">Redaction Patterns</div>
            <div className="text-xs text-[#F5F3EF]/50 mt-2">Learned signatures</div>
          </div>
          <div className="bg-[#1A1A1D] border border-[#C9A962]/20 rounded-lg p-6">
            <div className="text-3xl font-bold text-[#7B68A0]">78%</div>
            <div className="text-[#F5F3EF]/70 mt-1">Avg Confidence</div>
            <div className="text-xs text-[#F5F3EF]/50 mt-2">Reconstruction accuracy</div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Passage List */}
          <div className="bg-[#1A1A1D] border border-[#C9A962]/20 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-[#C9A962] mb-4">Q Passages</h2>
            <div className="space-y-2 max-h-[500px] overflow-y-auto">
              {synopticPassages.map((passage) => (
                <button
                  key={passage.id}
                  onClick={() => setSelectedPassage(passage)}
                  className={`w-full text-left p-3 rounded-lg transition-all ${
                    selectedPassage.id === passage.id
                      ? 'bg-[#C9A962]/20 border border-[#C9A962]/50'
                      : 'bg-[#0D0D0F] border border-[#C9A962]/10 hover:border-[#C9A962]/30'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-mono text-[#C9A962] text-sm">{passage.qReference}</span>
                      <div className="text-[#F5F3EF] font-medium mt-1">{passage.title}</div>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded ${
                      passage.traditionType === 'double_mt_lk'
                        ? 'bg-[#C9A962]/20 text-[#C9A962]'
                        : 'bg-[#8B7355]/20 text-[#8B7355]'
                    }`}>
                      {passage.traditionType === 'double_mt_lk' ? 'Q' : 'Triple'}
                    </span>
                  </div>
                  <div className="flex gap-4 mt-2 text-xs text-[#F5F3EF]/50">
                    <span>{passage.matthewRef}</span>
                    <span>{passage.lukeRef}</span>
                    {passage.markRef && <span>{passage.markRef}</span>}
                  </div>
                  <div className="mt-2 h-1 bg-[#0D0D0F] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#C9A962]"
                      style={{ width: `${passage.confidence * 100}%` }}
                    />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Detail View */}
          <div className="lg:col-span-2 bg-[#1A1A1D] border border-[#C9A962]/20 rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-[#C9A962]">{selectedPassage.title}</h2>
                <span className="font-mono text-[#F5F3EF]/70">{selectedPassage.qReference}</span>
              </div>
              <div className="flex gap-2">
                {['alignment', 'reconstruction', 'analysis'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab as any)}
                    className={`px-4 py-2 rounded-lg text-sm capitalize ${
                      activeTab === tab
                        ? 'bg-[#C9A962] text-[#0D0D0F]'
                        : 'bg-[#0D0D0F] text-[#F5F3EF]/70 hover:text-[#F5F3EF]'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {activeTab === 'alignment' && (
              <div className="space-y-4">
                {/* Matthew */}
                <div className="bg-[#0D0D0F] rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-3 h-3 rounded-full bg-blue-500" />
                    <span className="font-medium text-[#F5F3EF]">Matthew</span>
                    <span className="text-[#F5F3EF]/50 text-sm">{selectedPassage.matthewRef}</span>
                  </div>
                  <p className="font-serif text-lg text-[#F5F3EF]/90 leading-relaxed">
                    {selectedPassage.matthewText}
                  </p>
                </div>

                {/* Mark (if exists) */}
                {selectedPassage.markRef && (
                  <div className="bg-[#0D0D0F] rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-3 h-3 rounded-full bg-red-500" />
                      <span className="font-medium text-[#F5F3EF]">Mark</span>
                      <span className="text-[#F5F3EF]/50 text-sm">{selectedPassage.markRef}</span>
                    </div>
                    <p className="font-serif text-lg text-[#F5F3EF]/90 leading-relaxed">
                      {selectedPassage.markText}
                    </p>
                  </div>
                )}

                {/* Luke */}
                <div className="bg-[#0D0D0F] rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-3 h-3 rounded-full bg-green-500" />
                    <span className="font-medium text-[#F5F3EF]">Luke</span>
                    <span className="text-[#F5F3EF]/50 text-sm">{selectedPassage.lukeRef}</span>
                  </div>
                  <p className="font-serif text-lg text-[#F5F3EF]/90 leading-relaxed">
                    {selectedPassage.lukeText}
                  </p>
                </div>

                {/* Similarity meter */}
                <div className="flex items-center gap-4 p-4 bg-[#0D0D0F] rounded-lg">
                  <span className="text-[#F5F3EF]/70">Textual Agreement:</span>
                  <div className="flex-1 h-2 bg-[#1A1A1D] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#C9A962] to-[#8B7355]"
                      style={{ width: `${selectedPassage.similarity * 100}%` }}
                    />
                  </div>
                  <span className="text-[#C9A962] font-mono">{(selectedPassage.similarity * 100).toFixed(0)}%</span>
                </div>
              </div>
            )}

            {activeTab === 'reconstruction' && (
              <div className="space-y-6">
                {selectedPassage.reconstructedQ ? (
                  <>
                    <div className="bg-[#C9A962]/10 border border-[#C9A962]/30 rounded-lg p-6">
                      <div className="flex items-center gap-2 mb-4">
                        <span className="w-3 h-3 rounded-full bg-[#C9A962]" />
                        <span className="font-medium text-[#C9A962]">Reconstructed Q Text</span>
                        <span className="ml-auto text-sm text-[#F5F3EF]/50">
                          Confidence: {(selectedPassage.confidence * 100).toFixed(0)}%
                        </span>
                      </div>
                      <p className="font-serif text-xl text-[#F5F3EF] leading-relaxed">
                        {selectedPassage.reconstructedQ}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-[#0D0D0F] rounded-lg p-4">
                        <h4 className="text-sm font-medium text-[#F5F3EF]/70 mb-2">Matthew Additions</h4>
                        <ul className="text-sm text-[#F5F3EF]/90 space-y-1">
                          <li>"τῷ πνεύματι" (in spirit)</li>
                          <li>"τῶν οὐρανῶν" (of heavens)</li>
                        </ul>
                      </div>
                      <div className="bg-[#0D0D0F] rounded-lg p-4">
                        <h4 className="text-sm font-medium text-[#F5F3EF]/70 mb-2">Luke Modifications</h4>
                        <ul className="text-sm text-[#F5F3EF]/90 space-y-1">
                          <li>Direct address "ὑμετέρα"</li>
                          <li>"τοῦ θεοῦ" (of God)</li>
                        </ul>
                      </div>
                    </div>

                    <div className="bg-[#0D0D0F] rounded-lg p-4">
                      <h4 className="text-sm font-medium text-[#F5F3EF]/70 mb-3">Confidence Interval</h4>
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-[#F5F3EF]/50">68%</span>
                        <div className="flex-1 relative h-6 bg-[#1A1A1D] rounded">
                          <div
                            className="absolute h-full bg-[#C9A962]/30 rounded"
                            style={{ left: '15%', right: '15%' }}
                          />
                          <div
                            className="absolute h-full w-1 bg-[#C9A962]"
                            style={{ left: `${selectedPassage.confidence * 100}%` }}
                          />
                        </div>
                        <span className="text-sm text-[#F5F3EF]/50">95%</span>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-12 text-[#F5F3EF]/50">
                    <p>Triple tradition passage - Q reconstruction not applicable</p>
                    <p className="text-sm mt-2">This passage appears in Mark and was likely sourced from there</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'analysis' && (
              <div className="space-y-6">
                {/* Doctrinal Profile */}
                <div className="bg-[#0D0D0F] rounded-lg p-4">
                  <h4 className="text-sm font-medium text-[#F5F3EF]/70 mb-4">Doctrinal Profile</h4>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={Object.entries(selectedPassage.doctrinalProfile || {}).map(([key, value]) => ({
                        axis: key.charAt(0).toUpperCase() + key.slice(1),
                        value: Math.abs(value as number),
                        direction: (value as number) >= 0 ? 'high' : 'low'
                      }))}>
                        <PolarGrid stroke="#C9A962" strokeOpacity={0.3} />
                        <PolarAngleAxis dataKey="axis" tick={{ fill: '#F5F3EF', fontSize: 12 }} />
                        <PolarRadiusAxis angle={30} domain={[0, 1]} tick={{ fill: '#F5F3EF', fontSize: 10 }} />
                        <Radar
                          name="Doctrinal Position"
                          dataKey="value"
                          stroke="#C9A962"
                          fill="#C9A962"
                          fillOpacity={0.4}
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Word frequency comparison */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-[#0D0D0F] rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-blue-400">
                      {selectedPassage.matthewText?.split(' ').length || 0}
                    </div>
                    <div className="text-sm text-[#F5F3EF]/70">Matthew words</div>
                  </div>
                  <div className="bg-[#0D0D0F] rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-green-400">
                      {selectedPassage.lukeText?.split(' ').length || 0}
                    </div>
                    <div className="text-sm text-[#F5F3EF]/70">Luke words</div>
                  </div>
                  <div className="bg-[#0D0D0F] rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-[#C9A962]">
                      {selectedPassage.reconstructedQ?.split(' ').length || 'N/A'}
                    </div>
                    <div className="text-sm text-[#F5F3EF]/70">Q words (est.)</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Redaction Patterns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#1A1A1D] border border-[#C9A962]/20 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-blue-400 mb-4">Matthew's Redaction Patterns</h2>
            <div className="space-y-3">
              {matthewPatterns.map((pattern, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-[#0D0D0F] rounded-lg">
                  <div>
                    <div className="text-[#F5F3EF]">{pattern.pattern}</div>
                    <div className="text-xs text-[#F5F3EF]/50">{pattern.doctrinal}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-blue-400 font-mono">{pattern.frequency}x</div>
                    <div className={`text-xs ${
                      pattern.type === 'addition' ? 'text-green-400' : 'text-yellow-400'
                    }`}>{pattern.type}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#1A1A1D] border border-[#C9A962]/20 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-green-400 mb-4">Luke's Redaction Patterns</h2>
            <div className="space-y-3">
              {lukePatterns.map((pattern, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-[#0D0D0F] rounded-lg">
                  <div>
                    <div className="text-[#F5F3EF]">{pattern.pattern}</div>
                    <div className="text-xs text-[#F5F3EF]/50">{pattern.doctrinal}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-green-400 font-mono">{pattern.frequency}x</div>
                    <div className={`text-xs ${
                      pattern.type === 'addition' ? 'text-green-400' :
                      pattern.type === 'emphasis' ? 'text-blue-400' : 'text-yellow-400'
                    }`}>{pattern.type}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Q Doctrinal Profile */}
        <div className="bg-[#1A1A1D] border border-[#C9A962]/20 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-[#C9A962] mb-4">Q Source Doctrinal Profile</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={doctrinalAxes}>
                  <PolarGrid stroke="#C9A962" strokeOpacity={0.3} />
                  <PolarAngleAxis dataKey="axis" tick={{ fill: '#F5F3EF', fontSize: 12 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 1]} tick={{ fill: '#F5F3EF', fontSize: 10 }} />
                  <Radar
                    name="Q Profile"
                    dataKey="value"
                    stroke="#C9A962"
                    fill="#C9A962"
                    fillOpacity={0.5}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-4">
              <p className="text-[#F5F3EF]/70">
                The reconstructed Q source shows strong emphasis on ethical teaching and eschatological themes,
                with relatively lower explicit Christological content compared to the finished Gospels.
              </p>
              <div className="space-y-2">
                {doctrinalAxes.map((axis) => (
                  <div key={axis.axis} className="flex items-center gap-3">
                    <span className="w-24 text-sm text-[#F5F3EF]/70">{axis.axis}</span>
                    <div className="flex-1 h-2 bg-[#0D0D0F] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#C9A962]"
                        style={{ width: `${axis.value * 100}%` }}
                      />
                    </div>
                    <span className="w-12 text-right text-sm text-[#C9A962]">{(axis.value * 100).toFixed(0)}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Tradition Distribution */}
        <div className="bg-[#1A1A1D] border border-[#C9A962]/20 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-[#C9A962] mb-4">Synoptic Tradition Distribution</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={traditionDistribution} layout="vertical">
                <XAxis type="number" tick={{ fill: '#F5F3EF' }} />
                <YAxis type="category" dataKey="name" tick={{ fill: '#F5F3EF' }} width={150} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1A1A1D', border: '1px solid #C9A962' }}
                  labelStyle={{ color: '#F5F3EF' }}
                />
                <Bar dataKey="value" fill="#C9A962" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
