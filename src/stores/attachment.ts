import { atom } from 'recoil';

import { AttachmentData } from '@/types/attachment';

export const initAttachment: AttachmentData = {
  idCard: null,
  bankbook: null,
};

export const attachmentState = atom<AttachmentData>({
  key: 'attachment',
  default: initAttachment,
});
