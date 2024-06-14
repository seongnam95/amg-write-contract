'use client';

import axios from 'axios';

import ContractForm, { DraftFormData } from '@/components/forms/DraftForm';
import { useToast } from '@/components/ui/Toast/use-toast';

const AdminPage = () => {
  const { toast } = useToast();

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
  };

  const handleSubmit = async (formData: DraftFormData) => {
    try {
      const data = {
        companyName: formData.companyName,
        startDate: formData.period.startDate,
        endDate: formData.period.endDate,
        pay: parseInt(formData.pay),
        payDate: parseInt(formData.payDate),
        payCycle: formData.payCycle,
      };

      const response = await axios.post('/api/draft', data);
      const link = response.data.link;
      const domainUrl = process.env.NEXT_PUBLIC_DOMAIN_URL;
      const contractUrl = `${domainUrl}/contract/${link}`;

      copyToClipboard(contractUrl)
        .then(() => {
          toast({
            title: '계약서 생성 완료',
            description: '링크가 클립보드에 복사되었습니다.',
            variant: 'success',
          });
        })
        .catch(() => {
          toast({
            title: '클립보드 복사 실패',
            description: '클립보드 복사 과정에서 오류가 발생했습니다.',
            variant: 'error',
          });
        });
    } catch (error) {
      console.log(error);
      toast({
        title: '계약서 생성 실패',
        description: '서버와의 연결이 원활하지 않습니다.',
        variant: 'error',
      });
    }
  };

  return (
    <div>
      <h1 className="mb-12 mt-8 text-xl font-bold">계약서 생성</h1>
      <ContractForm onSubmit={handleSubmit} />
    </div>
  );
};

export default AdminPage;
