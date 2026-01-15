'use client';

import * as React from 'react';
import {useState, useEffect} from 'react';
import {usePaystack} from '@/app/hooks/usePaystack';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {Loader2, CheckCircle2, AlertCircle} from 'lucide-react';

interface PaystackOnboardingProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete?: () => void;
}

interface Bank {
  id: number;
  name: string;
  code: string;
  slug: string;
}

export default function PaystackOnboarding({
  open,
  onOpenChange,
  onComplete,
}: PaystackOnboardingProps) {
  const {createSubaccount, isLoading, error} = usePaystack();
  const [step, setStep] = useState(1);
  const [banks, setBanks] = useState<Bank[]>([]);
  const [loadingBanks, setLoadingBanks] = useState(true);
  const [formData, setFormData] = useState({
    businessName: '',
    settlementBank: '',
    accountNumber: '',
    percentageCharge: '0',
    description: '',
    primaryContactEmail: '',
    primaryContactName: '',
  });
  const [accountName, setAccountName] = useState('');
  const [verifyingAccount, setVerifyingAccount] = useState(false);
  const [subaccountCreated, setSubaccountCreated] = useState(false);

  // Load banks when component mounts
  useEffect(() => {
    if (open) {
      fetchBanks();
    }
  }, [open]);

  const fetchBanks = async () => {
    try {
      setLoadingBanks(true);
      const response = await fetch('/api/paystack/banks?country=nigeria');
      const data = await response.json();
      if (data.success) {
        setBanks(data.banks);
      }
    } catch (err) {
      console.error('Error fetching banks:', err);
    } finally {
      setLoadingBanks(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({...prev, [field]: value}));
  };

  const verifyBankAccount = async () => {
    if (!formData.accountNumber || !formData.settlementBank) {
      return;
    }

    try {
      setVerifyingAccount(true);
      const response = await fetch(
        `/api/paystack/verify_account?account_number=${formData.accountNumber}&bank_code=${formData.settlementBank}`
      );
      const data = await response.json();

      if (data.success) {
        setAccountName(data.accountName);
      }
    } catch (err) {
      console.error('Error verifying account:', err);
    } finally {
      setVerifyingAccount(false);
    }
  };

  const handleSubmit = async () => {
    try {
      const result = await createSubaccount({
        business_name: formData.businessName,
        settlement_bank: formData.settlementBank,
        account_number: formData.accountNumber,
        percentage_charge: parseFloat(formData.percentageCharge),
        description: formData.description,
        primary_contact_email: formData.primaryContactEmail,
        primary_contact_name: formData.primaryContactName,
      });

      if (result) {
        setSubaccountCreated(true);
        setStep(3);
        if (onComplete) {
          setTimeout(() => {
            onComplete();
          }, 2000);
        }
      }
    } catch (err) {
      console.error('Error creating subaccount:', err);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="businessName">Business Name *</Label>
        <Input
          id="businessName"
          value={formData.businessName}
          onChange={(e) => handleInputChange('businessName', e.target.value)}
          placeholder="Enter your business name"
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          placeholder="Brief description of your business"
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="primaryContactName">Contact Name</Label>
        <Input
          id="primaryContactName"
          value={formData.primaryContactName}
          onChange={(e) =>
            handleInputChange('primaryContactName', e.target.value)
          }
          placeholder="Primary contact person"
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="primaryContactEmail">Contact Email</Label>
        <Input
          id="primaryContactEmail"
          type="email"
          value={formData.primaryContactEmail}
          onChange={(e) =>
            handleInputChange('primaryContactEmail', e.target.value)
          }
          placeholder="contact@business.com"
          className="mt-1"
        />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button
          variant="outline"
          onClick={() => onOpenChange(false)}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button
          onClick={() => setStep(2)}
          disabled={!formData.businessName || isLoading}
        >
          Next: Bank Details
        </Button>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="settlementBank">Settlement Bank *</Label>
        <Select
          value={formData.settlementBank}
          onValueChange={(value) => handleInputChange('settlementBank', value)}
          disabled={loadingBanks}
        >
          <SelectTrigger className="mt-1">
            <SelectValue placeholder="Select your bank" />
          </SelectTrigger>
          <SelectContent>
            {banks.map((bank) => (
              <SelectItem key={bank.code} value={bank.code}>
                {bank.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="accountNumber">Account Number *</Label>
        <Input
          id="accountNumber"
          value={formData.accountNumber}
          onChange={(e) => handleInputChange('accountNumber', e.target.value)}
          onBlur={verifyBankAccount}
          placeholder="0000000000"
          className="mt-1"
          maxLength={10}
        />
        {verifyingAccount && (
          <p className="mt-1 text-sm text-gray-500">Verifying account...</p>
        )}
        {accountName && (
          <p className="mt-1 text-sm text-green-600">
            <CheckCircle2 className="mr-1 inline h-4 w-4" />
            {accountName}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="percentageCharge">Platform Fee (%)</Label>
        <Input
          id="percentageCharge"
          type="number"
          value={formData.percentageCharge}
          onChange={(e) =>
            handleInputChange('percentageCharge', e.target.value)
          }
          placeholder="0"
          min="0"
          max="100"
          step="0.1"
          className="mt-1"
        />
        <p className="mt-1 text-sm text-gray-500">
          Percentage of transaction amount you want to charge the subaccount
        </p>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button
          variant="outline"
          onClick={() => setStep(1)}
          disabled={isLoading}
        >
          Back
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={
            !formData.settlementBank ||
            !formData.accountNumber ||
            formData.accountNumber.length !== 10 || // Nigerian bank accounts are 10 digits
            isLoading
          }
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating Subaccount...
            </>
          ) : (
            'Create Subaccount'
          )}
        </Button>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-4 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
        <CheckCircle2 className="h-8 w-8 text-green-600" />
      </div>
      <div>
        <h3 className="text-lg font-semibold">Subaccount Created!</h3>
        <p className="mt-2 text-sm text-gray-600">
          Your Paystack subaccount has been created successfully. You can now
          start accepting payments.
        </p>
      </div>
      <Button onClick={() => onOpenChange(false)} className="mt-4">
        Get Started
      </Button>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {step === 1 && 'Business Information'}
            {step === 2 && 'Bank Account Details'}
            {step === 3 && 'Setup Complete'}
          </DialogTitle>
          <DialogDescription>
            {step === 1 &&
              'Enter your business details to get started with Paystack'}
            {step === 2 &&
              'Provide your bank account for receiving settlements'}
            {step === 3 && 'Your Paystack account is ready to use'}
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="rounded-md bg-red-50 p-3">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-red-400" />
              <p className="ml-3 text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}

        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
      </DialogContent>
    </Dialog>
  );
}
