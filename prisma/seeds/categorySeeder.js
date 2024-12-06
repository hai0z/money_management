const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function seedCategories() {
  // Tạo categories cha trước
  const parentCategories = [
    { name: "Ăn uống", type: "expense" },
    { name: "Dịch vụ sinh hoạt", type: "expense" },
    { name: "Di lại", type: "expense" },
    { name: "Con cái", type: "expense" },
    { name: "Trang phục", type: "expense" },
    { name: "Hiếu hỉ", type: "expense" },
    { name: "Sức khỏe", type: "expense" },
    { name: "Nhà cửa", type: "expense" },
    { name: "Hưởng thụ", type: "expense" },
    { name: "Phát triển bản thân", type: "expense" },
    { name: "Ngân hàng", type: "expense" },
  ];

  const parentCategoryMap = {};

  // Tạo categories cha và lưu id
  for (const category of parentCategories) {
    const created = await prisma.category.create({
      data: category,
    });
    parentCategoryMap[category.name] = created.id;
  }

  // Danh sách categories con với reference đến category cha
  const childCategories = [
    // Ăn uống
    {
      name: "Đi chơi/hẹn hò",
      type: "expense",
      parentId: parentCategoryMap["Ăn uống"],
    },
    {
      name: "Ăn kiêng",
      type: "expense",
      parentId: parentCategoryMap["Ăn uống"],
    },
    { name: "Cafe", type: "expense", parentId: parentCategoryMap["Ăn uống"] },
    {
      name: "Ăn sáng",
      type: "expense",
      parentId: parentCategoryMap["Ăn uống"],
    },
    {
      name: "Ăn trưa",
      type: "expense",
      parentId: parentCategoryMap["Ăn uống"],
    },
    { name: "Ăn tối", type: "expense", parentId: parentCategoryMap["Ăn uống"] },

    // Dịch vụ sinh hoạt
    {
      name: "Điện",
      type: "expense",
      parentId: parentCategoryMap["Dịch vụ sinh hoạt"],
    },
    {
      name: "Nước",
      type: "expense",
      parentId: parentCategoryMap["Dịch vụ sinh hoạt"],
    },
    {
      name: "Internet",
      type: "expense",
      parentId: parentCategoryMap["Dịch vụ sinh hoạt"],
    },
    {
      name: "Điện thoại di động",
      type: "expense",
      parentId: parentCategoryMap["Dịch vụ sinh hoạt"],
    },
    {
      name: "Gas",
      type: "expense",
      parentId: parentCategoryMap["Dịch vụ sinh hoạt"],
    },
    {
      name: "Truyền hình",
      type: "expense",
      parentId: parentCategoryMap["Dịch vụ sinh hoạt"],
    },
    {
      name: "Điện thoại cố định",
      type: "expense",
      parentId: parentCategoryMap["Dịch vụ sinh hoạt"],
    },
    {
      name: "Phí ngân hàng/ATM",
      type: "expense",
      parentId: parentCategoryMap["Dịch vụ sinh hoạt"],
    },

    // Di lại
    { name: "Xăng xe", type: "expense", parentId: parentCategoryMap["Di lại"] },
    {
      name: "Bảo hiểm xe",
      type: "expense",
      parentId: parentCategoryMap["Di lại"],
    },
    {
      name: "Sửa chữa, bảo dưỡng xe",
      type: "expense",
      parentId: parentCategoryMap["Di lại"],
    },
    { name: "Gửi xe", type: "expense", parentId: parentCategoryMap["Di lại"] },
    { name: "Rửa xe", type: "expense", parentId: parentCategoryMap["Di lại"] },
    {
      name: "Taxi/thuê xe",
      type: "expense",
      parentId: parentCategoryMap["Di lại"],
    },

    // Con cái
    {
      name: "Học phí",
      type: "expense",
      parentId: parentCategoryMap["Con cái"],
    },
    {
      name: "Sách vở",
      type: "expense",
      parentId: parentCategoryMap["Con cái"],
    },
    {
      name: "Đồ chơi",
      type: "expense",
      parentId: parentCategoryMap["Con cái"],
    },
    {
      name: "Tiền tiêu vặt",
      type: "expense",
      parentId: parentCategoryMap["Con cái"],
    },

    // Trang phục
    {
      name: "Quần áo",
      type: "expense",
      parentId: parentCategoryMap["Trang phục"],
    },
    {
      name: "Giày dép",
      type: "expense",
      parentId: parentCategoryMap["Trang phục"],
    },
    {
      name: "Phụ kiện khác",
      type: "expense",
      parentId: parentCategoryMap["Trang phục"],
    },

    // Hiếu hỉ
    {
      name: "Cưới xin",
      type: "expense",
      parentId: parentCategoryMap["Hiếu hỉ"],
    },
    {
      name: "Ma chay",
      type: "expense",
      parentId: parentCategoryMap["Hiếu hỉ"],
    },
    {
      name: "Thăm hỏi",
      type: "expense",
      parentId: parentCategoryMap["Hiếu hỉ"],
    },
    {
      name: "Biếu tặng",
      type: "expense",
      parentId: parentCategoryMap["Hiếu hỉ"],
    },

    // Sức khỏe
    {
      name: "Khám chữa bệnh",
      type: "expense",
      parentId: parentCategoryMap["Sức khỏe"],
    },
    {
      name: "Thuốc men",
      type: "expense",
      parentId: parentCategoryMap["Sức khỏe"],
    },
    {
      name: "Thể thao",
      type: "expense",
      parentId: parentCategoryMap["Sức khỏe"],
    },

    // Nhà cửa
    {
      name: "Mua sắm đồ đạc",
      type: "expense",
      parentId: parentCategoryMap["Nhà cửa"],
    },
    {
      name: "Sửa chữa nhà cửa",
      type: "expense",
      parentId: parentCategoryMap["Nhà cửa"],
    },
    {
      name: "Thuê nhà",
      type: "expense",
      parentId: parentCategoryMap["Nhà cửa"],
    },

    // Hưởng thụ
    {
      name: "Vui chơi giải trí",
      type: "expense",
      parentId: parentCategoryMap["Hưởng thụ"],
    },
    {
      name: "Du lịch",
      type: "expense",
      parentId: parentCategoryMap["Hưởng thụ"],
    },
    {
      name: "Làm đẹp",
      type: "expense",
      parentId: parentCategoryMap["Hưởng thụ"],
    },
    {
      name: "Phim ảnh ca nhạc",
      type: "expense",
      parentId: parentCategoryMap["Hưởng thụ"],
    },
    {
      name: "Mỹ phẩm",
      type: "expense",
      parentId: parentCategoryMap["Hưởng thụ"],
    },

    // Phát triển bản thân
    {
      name: "Học hành",
      type: "expense",
      parentId: parentCategoryMap["Phát triển bản thân"],
    },
    {
      name: "Giao lưu, quan hệ",
      type: "expense",
      parentId: parentCategoryMap["Phát triển bản thân"],
    },

    // Ngân hàng
    {
      name: "Phí chuyển khoản",
      type: "expense",
      parentId: parentCategoryMap["Ngân hàng"],
    },
  ];

  // Tạo categories con
  for (const category of childCategories) {
    await prisma.category.create({
      data: category,
    });
  }

  // Tạo categories thu nhập (không có category con)
  const incomeCategories = [
    { name: "Lương", type: "income" },
    { name: "Thưởng", type: "income" },
    { name: "Được tặng", type: "income" },
  ];

  for (const category of incomeCategories) {
    await prisma.category.create({
      data: category,
    });
  }

  console.log("Categories seeded successfully");
}

async function main() {
  try {
    await seedCategories();
  } catch (error) {
    console.error("Error seeding categories:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
