import { users, usersRelations } from '@/db/schemas/users';
import { api, apiRelations } from '@/db/schemas/api';
import { userApi, userApiRelations } from '@/db/schemas/userApi';
import { link, linkRelations } from '@/db/schemas/link';
import { linkFolder, linkFolderRelations } from '@/db/schemas/linkFolder';
import { linkSafety, linkSafetyRelations } from '@/db/schemas/linkSafety';
import { linkView, linkViewRelations } from '@/db/schemas/linkView';
import { linkReport, linkReportRelations } from '@/db/schemas/linkReport';

export {
  users,
  api,
  userApi,
  link,
  linkFolder,
  linkSafety,
  linkView,
  linkReport,
  usersRelations,
  apiRelations,
  userApiRelations,
  linkRelations,
  linkFolderRelations,
  linkSafetyRelations,
  linkViewRelations,
  linkReportRelations,
};
