const bcrypt = require('bcryptjs');

const users = [
  {
    name: 'admin',
    email: 'doanthy0603@gmail.com',
    password: bcrypt.hashSync('123456', 10),
    isAdmin: true,
    status: 'Active',
  },
  {
    name: 'Việt Trinh',
    email: 'trinh@gmail.com',
    password: bcrypt.hashSync('123456', 10),
    status: 'Active',
  },
  {
    name: 'Thùy Trang',
    email: 'trang@gmail.com',
    password: bcrypt.hashSync('123456', 10),
    status: 'Active',
  },
  {
    name: 'Mỹ Thanh',
    email: 'thanh@gmail.com',
    password: bcrypt.hashSync('123456', 10),
    status: 'Active',
  },
  {
    name: 'Hoàng Dũng',
    email: 'dung@gmail.com',
    password: bcrypt.hashSync('123456', 10),
  },
  {
    name: 'Thanh Tuyền',
    email: 'tuyen@gmail.com',
    password: bcrypt.hashSync('123456', 10),
    status: 'Active',
  },
  {
    name: 'Minh Kiệt',
    email: 'kiet@gmail.com',
    password: bcrypt.hashSync('123456', 10),
  },
  {
    name: 'Diễm Kiều',
    email: 'kieu@gmail.com',
    password: bcrypt.hashSync('123456', 10),
  },
  {
    name: 'Thuần Phong',
    email: 'phong@gmail.com',
    password: bcrypt.hashSync('123456', 10),
    status: 'Active',
  },
  {
    name: 'Ngọc Nhân',
    email: 'nhan@gmail.com',
    password: bcrypt.hashSync('123456', 10),
  },
  {
    name: 'Thu Hồng',
    email: 'hong@gmail.com',
    password: bcrypt.hashSync('123456', 10),
  },
  {
    name: 'Thùy Dương',
    email: 'duong@gmail.com',
    password: bcrypt.hashSync('123456', 10),
    status: 'Active',
  },
  {
    name: 'Thanh Thảo',
    email: 'thao@gmail.com',
    password: bcrypt.hashSync('123456', 10),
    status: 'Active',
  },
  {
    name: 'Mỹ Linh',
    email: 'linh@gmail.com',
    password: bcrypt.hashSync('123456', 10),
  },
  {
    name: 'Chiến Thắng',
    email: 'thang@gmail.com',
    password: bcrypt.hashSync('123456', 10),
  },
];

module.exports = users;
