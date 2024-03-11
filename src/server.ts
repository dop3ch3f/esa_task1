import App from '@/app';
import { AuthRoute } from '@routes/auth.route';
import { UserRoute } from '@routes/users.route';
import { ValidateEnv } from '@utils/validateEnv';
import { IndexRoute } from '@routes/index.route';

ValidateEnv();

const app = new App([new AuthRoute(), new UserRoute(), new IndexRoute()]);

app.listen();
