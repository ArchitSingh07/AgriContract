import { useState } from 'react';
import { Button } from './ui/button';
import { ArrowLeft, CheckCircle } from 'lucide-react';

export function ContractFinalization({ contractData, user, onNavigate }) {
  const [agreed, setAgreed] = useState(false);

  const handleGenerateContract = () => {
    const finalContract = {
      ...contractData,
      contractId: `CON-${Date.now()}`,
      status: 'pending_signatures'
    };
    onNavigate('contract-view', finalContract);
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center space-x-4 mb-6">
          <Button
            variant="ghost"
            onClick={() => onNavigate('dashboard')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-bold">Contract Finalization</h1>
        </div>

        <div className="bg-card p-6 rounded-lg border">
          <h2 className="text-xl font-semibold mb-4">Contract Terms</h2>
          <p className="text-muted-foreground mb-6">
            Review and agree to the contract terms below.
          </p>

          <div className="space-y-4 mb-6">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="agreement"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
              />
              <label htmlFor="agreement" className="text-sm">
                I agree to all terms and conditions
              </label>
            </div>
          </div>

          <Button
            onClick={handleGenerateContract}
            disabled={!agreed}
            className="w-full"
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Generate Contract
          </Button>
        </div>
      </div>
    </div>
  );
}