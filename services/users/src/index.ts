import { isTest } from './config/environment';

if (!isTest) {
  import('./server');
}
