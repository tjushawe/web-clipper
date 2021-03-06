import { AccountPreference, ImageHosting } from '../../store/reducers/userPreference/interface';
export interface PreferenceStorage {
  accounts: AccountPreference[];
  imageHosting: ImageHosting[];
  defaultPluginId?: string | null;
  defaultAccountId?: string;
  showLineNumber: boolean;
  liveRendering: boolean;
}
