import { Instance } from 'seneca';

export function product(options: any) {
    const seneca = this as Instance;

    seneca.add({ area: 'product', action: 'fetch' }, function (args, done) {
        const products = this.make("products");
        products.list$({}, done);
    });

    seneca.add({ area: 'product', action: 'fetch', criteria: 'byCategory' }, function (args, done) {
        const products = this.make('products');
        products.list$({ category: args.category }, done);
    });

    seneca.add({ area: 'product', action: 'fetch', criteria: 'byId' }, function (args, done) {
        const product = this.make('products');
        product.load$(args.id, done);
    });

    seneca.add({ area: 'product', action: 'add' }, function (args, done) {
        const products = this.make("products");
        products.category = args.category;
        products.name = args.name;
        products.description = args.description;
        products.price = args.price;
        products.save$(function (err, product) {
            done(err, products.data$(false));
        })
    });

    seneca.add({ area: 'product', action: 'remove' }, function (args, done) {
        const product = this.make('products');
        product.remove$(args.id, function (err) {
            done(err, null);
        });
    });

    seneca.add({ area: 'product', action: 'edit' }, function (args, done) {
        seneca.act({ area: 'product', action: 'fetch', criteria: 'byId', id: args.id }, function (err, result) {
            result.data$({
                name: args.name,
                category: args.description,
                price: args.price
            });

            result.save$(function (err, product) {
                done(product.data$(false));
            })
        })
    })

}