 === Map ===

            const obj = {
                name: 'Pavel',
                surname: 'Kotov',
                age: '35',
            };

            const arr = [
                ['name', 'Pavel'],
                ['surname', 'Kotov'],
                ['age', '35'],
            ];

            console.log(Object.entries(obj));
            console.log(Object.fromEntries(arr));

            const map = new Map(arr);

            console.log(map.get('name'));

            map.set('newfield', '52').set(obj, 'value Of Obj').set(NaN, 'not a number');

            map.delete('name');
            console.log(map.size);
            map.clear();
            console.log(map);

            console.log(map.entries());

            for (let [key, value] of map) {
                console.log(key, value);
            }

            for (let key of map.keys()) {
                console.log(key);
            }

            map.forEach((val, key, m) => {
                console.log(key, val);
            });

            const arr2 = Array.from(map);
            const arr3 = [...map];
            const mapObj = Object.fromEntries(map.entries());
            console.log(mapObj);

            const users = [{ name: 'Elena' }, { name: 'Ivan' }, { name: 'Vasya' }];

            const visits = new Map();
            visits
                .set(users[0], new Date())
                .set(users[1], new Date(new Date().getTime() + 1000 * 60))
                .set(users[2], new Date(new Date().getTime() + 5000 * 60));
            function lastVisit(user) {
                return visits.get(user);
            }

            ==== SET ===

            const set = new Set([1, 2, 3, 3, 3, 4, 5, 5, 6]);
            set.add(10).add(20).add(30).add(20);

            const uniqueValuesOf = (array) => [...new Set(array)];

            console.log(uniqueValuesOf([1, 1, 1, 2, 3, 3, 3, 4, 4, 4, 5, 5, 5, 4, 4, 4, 6, 6, 6]));

            == weakmap ==
            let obj = { name: 'weakmap' };
            const arr = [obj];
            obj = null;
            console.log(arr);

            const map = new WeakMap([[obj, 'objData']]);
            obj = null;

            const cache = new WeakMap();
            function cacheUsers(user) {
                if (!cache.has(user)) {
                    cache.set(user, Date.now());
                }
                return cache.get(user);
            }

            let lena = { name: 'Elena' };
            let alex = { name: 'Alex' };

            cacheUsers(lena);
            cacheUsers(alex);
            console.log(cache.has(lena));
            console.log(cache.has(alex));
            console.log(cache);

            const map = new Map();
            let lena = { name: 'Lena', family: 'Smoilova', visits: 3 };

            let sasha = { name: 'Sasha', family: 'Moskvin', visits: 2 };

            map.set(lena['name'], lena).set(sasha);

            console.log(map);