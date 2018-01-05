import * as seneca from 'seneca';
import * as seneca_web from 'seneca-web';
import * as seneca_web_adapter_express from 'seneca-web-adapter-express';
import * as seneca_entity from 'seneca-entity';
import * as express from 'express';
import * as body_parser from 'body-parser';
import { product } from './product';

const sen = seneca();


sen.use(seneca_entity)
    .use(product);

sen.ready(function (err) {
    const app = express();

    const routes = [
        {
            pin: 'area:product,action:*',
            prefix: '/products',
            map: {
                fetch: {
                    GET: true
                },
                add: {
                    GET: false,
                    POST: true
                },
                edit: {
                    GET: false,
                    POST: true
                },
                remove: {
                    GET: false,
                    DELETE: true
                }
            }
        }
    ]

    var config = {
        context: app,
        adapter: seneca_web_adapter_express,
        routes: routes
    }

    sen.use(seneca_web, config);
    app.use(body_parser.json());
    app.listen(3000);
});


