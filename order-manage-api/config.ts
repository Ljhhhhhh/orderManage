import { config as configDev } from './config/config.development';
import { config as configProd } from './config/config.production';

const envConfig =
    process.env.NODE_ENV === 'production' ? configProd : configDev;

console.log(envConfig);
export default envConfig;
