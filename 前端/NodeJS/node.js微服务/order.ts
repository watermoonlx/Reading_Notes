import * as seneca from 'seneca';
import { Instance } from 'seneca';

const senecaEmailer = seneca().client({ host: '192:168:0.2', port: 8080 });

export function product(options: any) {
    const seneca = this as Instance;

    seneca.add({ area: 'orders', action: 'fetch' }, function (args, done) {
        const products = this.make("orders");
        products.list$({ id: args.id }, done);
    });


    seneca.add({ area: 'orders', action: 'delete' }, function (args, done) {
        const product = this.make('order');
        product.remove$({ id: args.id }, function (err) {
            done(err, null);
        });
    });

    seneca.add({ area: 'orders', action: 'create' }, function (args, done) {
        const products = args.products as any[];
        let total = 0.0;
        products.forEach(p => total += p.price);
        const orders = this.make('orders');
        orders.total = total;
        orders.customer_email = args.email;
        orders.customer_name = args.name;
        orders.save$(function (err, order) {
            const pattern=
        })
    })
}