export type Lead = {
  id: string;
  createdAt: string;
  name: string;
  company: string;
  contact: string;
  budget: string;
  message: string;
  locale: string;
  ip?: string;
  status: "new" | "read" | "archived";
};

export type Settings = {
  notifyTelegram: boolean;
  autoReplyEnabled: boolean;
  emailFooter: string;
  updatedAt: string;
};
