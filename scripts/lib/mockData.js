var mock = {
    getCustomer: function () {
        return {
            firstName: "John",
            lastName: "Smith"
        };
    },
    getCustomerOrderHistory: function() {
        return [];
    },
    getProducts: function () {
        return [
                {
                    id: 1,
                    title: "Bad Boy",
                    detail: "Nam aliquam consequat ultricies. Vestibulum eget tellus rutrum, bibendum augue eget, efficitur diam. Mauris et dapibus dolor, at blandit arcu. Donec efficitur euismod elit, ut ultricies justo dignissim nec. ",
                    imageUrl: "/content/images/badboy.jpg",
                    price: 9.99,
                    rating: 4
                },
                {
                    id: 2,
                    title: "Beetle War",
                    detail: "Vestibulum et nisl quis ligula semper congue ut at tortor. In suscipit felis quis imperdiet rutrum. Sed lacinia eleifend molestie. Donec ultrices odio in mauris consequat, ut vehicula nibh ultrices. Vivamus dui mauris, sodales sit amet nibh a, porttitor molestie metus.",
                    imageUrl: "/content/images/beetle.jpg",
                    price: 10.99,
                    rating: 2
                },
                {
                    id: 3,
                    title: "Iron Chef",
                    detail: "Nunc lobortis ex a tellus suscipit accumsan. Donec bibendum vel magna quis condimentum. Ut sagittis tincidunt fringilla. Nunc posuere orci eget magna auctor mattis. Integer porta ex non vulputate mollis. Pellentesque sollicitudin vel metus sed porta.",
                    imageUrl: "/content/images/chef.jpg",
                    price: 11.99,
                    rating: 5
                },
                {
                    id: 4,
                    title: "Cool Guy",
                    detail: "Proin blandit sit amet odio vel aliquam. Donec pulvinar libero id nulla efficitur aliquam. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Cras vulputate libero ut massa blandit, laoreet tempor neque ultricies.",
                    imageUrl: "/content/images/coolguy.jpg",
                    price: 9.99,
                    rating: 3
                },
                {
                    id: 5,
                    title: "Dragon's Den",
                    detail: "Nunc finibus malesuada cursus. Sed nibh libero, malesuada vel magna nec, varius mollis lacus. Curabitur id vulputate odio, nec commodo lorem. Nullam et nulla sit amet erat pretium imperdiet nec sit amet justo. ",
                    imageUrl: "/content/images/dragon.jpg",
                    price: 12.99,
                    rating: 4
                },
                {
                    id: 6,
                    title: "Little Painter",
                    detail: "Mauris porta lacus vel tellus porttitor, vitae commodo libero dignissim. Curabitur orci diam, volutpat aliquet velit ac, pulvinar rutrum libero. Phasellus congue massa id arcu suscipit, vitae hendrerit nisl dignissim. Vivamus et pretium ex. Sed at sapien quis orci interdum pulvinar.",
                    imageUrl: "/content/images/paint.jpg",
                    price: 14.99,
                    rating: 5
                },
                {
                    id: 7,
                    title: "Pig Fun",
                    detail: "Fusce dignissim purus sit amet dui vehicula feugiat. Nulla tempor tellus vitae aliquam aliquam. Pellentesque fringilla orci a ligula condimentum, in pulvinar est consectetur. Maecenas volutpat, diam a dignissim dictum, felis risus aliquet massa, at mattis tortor risus id nisl. Sed ultricies cursus posuere. Suspendisse egestas mauris libero, quis pharetra elit aliquam quis.",
                    imageUrl: "/content/images/pigfun.jpg",
                    price: 19.99,
                    rating: 2
                },
                {
                    id: 8,
                    title: "Robot's War",
                    detail: "Quisque sollicitudin velit augue, rutrum dignissim nisi tempor nec. In sed ante nibh. Nam congue tortor ante. Nulla eget felis at ante varius malesuada. Aenean eu sagittis turpis, eget facilisis tellus. Maecenas commodo massa sed neque maximus posuere. Vivamus neque eros, gravida id massa bibendum, maximus scelerisque tortor.",
                    imageUrl: "/content/images/robot.jpg",
                    price: 12.99 ,
                    rating: 1
                }
        ];
    }
};