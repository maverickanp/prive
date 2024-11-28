import moduleAlias from 'module-alias';
import { join } from 'path';

moduleAlias.addAliases({
  '@': join(__dirname, '../../')
});