import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MOCK_CARRIERS } from '@/data/mockData';
import { AlertTriangle, BarChart3, MapPin, Shield } from 'lucide-react';

const MOCK_CAPACITY = [
  {
    carrierId: 'c1', carrierName: 'Pan American',
    maxPremium: 50000000, currentPremium: 42500000, pctUsed: 85,
    maxLives: 15000, currentLives: 12800,
    largestGroup: 'Lakeside Healthcare System', largestGroupPremium: 4800000,
    topStates: [{ state: 'MN', lives: 3200, pct: 25 }, { state: 'WI', lives: 2400, pct: 18.8 }, { state: 'OH', lives: 1800, pct: 14.1 }],
    alerts: ['Approaching 85% of annual premium capacity', 'MN concentration at 25% — above 20% threshold'],
  },
  {
    carrierId: 'c2', carrierName: 'Tokio Marine HCC',
    maxPremium: 30000000, currentPremium: 18200000, pctUsed: 60.7,
    maxLives: 8000, currentLives: 4800,
    largestGroup: 'Pacific Coast Logistics', largestGroupPremium: 2100000,
    topStates: [{ state: 'CA', lives: 1400, pct: 29.2 }, { state: 'TX', lives: 900, pct: 18.8 }, { state: 'FL', lives: 650, pct: 13.5 }],
    alerts: ['CA concentration at 29.2% — above 20% threshold'],
  },
  {
    carrierId: 'c3', carrierName: 'BHSI',
    maxPremium: 15000000, currentPremium: 6800000, pctUsed: 45.3,
    maxLives: 4000, currentLives: 1800,
    largestGroup: 'Sunbelt Retail Group', largestGroupPremium: 1200000,
    topStates: [{ state: 'CO', lives: 520, pct: 28.9 }, { state: 'CA', lives: 380, pct: 21.1 }],
    alerts: [],
  },
  {
    carrierId: 'c4', carrierName: 'SLAIC',
    maxPremium: 40000000, currentPremium: 28700000, pctUsed: 71.8,
    maxLives: 12000, currentLives: 8600,
    largestGroup: 'Heartland School District #47', largestGroupPremium: 1400000,
    topStates: [{ state: 'IA', lives: 2100, pct: 24.4 }, { state: 'MN', lives: 1800, pct: 20.9 }, { state: 'TX', lives: 1200, pct: 14.0 }],
    alerts: ['IA concentration at 24.4% — above 20% threshold'],
  },
];

export default function CarrierCapacity() {
  return (
    <div className="p-6 lg:p-8 space-y-5 max-w-[1400px]">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Carrier Capacity & Exposure</h1>
        <p className="text-sm text-muted-foreground mt-1">Track premium placement and concentration risk across carriers</p>
      </div>

      <div className="space-y-5">
        {MOCK_CAPACITY.map(c => (
          <Card key={c.carrierId} className="border shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Shield className="w-4 h-4 text-primary" />
                {c.carrierName}
                <Badge variant="outline" className={`ml-2 text-xs ${c.pctUsed > 80 ? 'border-destructive/40 text-destructive' : c.pctUsed > 60 ? 'border-warning/40 text-warning' : 'border-emerald-400 text-emerald-700'}`}>
                  {c.pctUsed.toFixed(1)}% capacity
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Premium bar */}
              <div>
                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                  <span>Premium: ${(c.currentPremium / 1e6).toFixed(1)}M of ${(c.maxPremium / 1e6).toFixed(0)}M</span>
                  <span>Lives: {c.currentLives.toLocaleString()} of {c.maxLives.toLocaleString()}</span>
                </div>
                <div className="h-3 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${c.pctUsed > 80 ? 'bg-destructive' : c.pctUsed > 60 ? 'bg-warning' : 'bg-emerald-500'}`}
                    style={{ width: `${c.pctUsed}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Top states */}
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1"><MapPin className="w-3 h-3" /> Geographic Concentration</p>
                  <div className="space-y-1">
                    {c.topStates.map(s => (
                      <div key={s.state} className="flex items-center gap-2">
                        <span className="text-xs w-8 font-mono font-medium">{s.state}</span>
                        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${s.pct > 20 ? 'bg-warning' : 'bg-primary/40'}`} style={{ width: `${Math.min(s.pct * 3, 100)}%` }} />
                        </div>
                        <span className="text-[10px] text-muted-foreground w-16 text-right">{s.lives} ({s.pct}%)</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Largest group */}
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1"><BarChart3 className="w-3 h-3" /> Largest Single Group</p>
                  <div className="bg-muted/30 rounded-md p-3">
                    <p className="text-sm font-medium text-foreground">{c.largestGroup}</p>
                    <p className="text-xs text-muted-foreground">${(c.largestGroupPremium / 1e6).toFixed(1)}M premium ({((c.largestGroupPremium / c.currentPremium) * 100).toFixed(1)}% of book)</p>
                  </div>
                </div>
              </div>

              {/* Alerts */}
              {c.alerts.length > 0 && (
                <div className="space-y-1">
                  {c.alerts.map((a, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-warning bg-warning/10 rounded-md p-2">
                      <AlertTriangle className="w-3 h-3 shrink-0" />
                      {a}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
