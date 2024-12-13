const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function seedCategories() {
  // Tạo categories cha trước
  const parentCategories = [
    {
      name: "Ăn uống",
      type: "expense",
      icon: "https://cdn-icons-png.flaticon.com/512/1046/1046857.png",
    },
    {
      name: "Dịch vụ sinh hoạt",
      type: "expense",
      icon: "https://cdn-icons-png.flaticon.com/512/1670/1670075.png",
    },
    {
      name: "Đi lại",
      type: "expense",
      icon: "https://cdn-icons-png.flaticon.com/512/3097/3097180.png",
    },
    {
      name: "Con cái",
      type: "expense",
      icon: "https://cdn-icons-png.flaticon.com/512/2454/2454297.png",
    },
    {
      name: "Trang phục",
      type: "expense",
      icon: "https://cdn-icons-png.flaticon.com/512/3531/3531849.png",
    },
    {
      name: "Hiếu hỉ",
      type: "expense",
      icon: "https://cdn-icons-png.flaticon.com/512/2454/2454282.png",
    },
    {
      name: "Sức khỏe",
      type: "expense",
      icon: "https://cdn-icons-png.flaticon.com/512/2966/2966327.png",
    },
    {
      name: "Nhà cửa",
      type: "expense",
      icon: "https://cdn-icons-png.flaticon.com/512/619/619153.png",
    },
    {
      name: "Hưởng thụ",
      type: "expense",
      icon: "https://cdn-icons-png.flaticon.com/512/3163/3163478.png",
    },
    {
      name: "Phát triển bản thân",
      type: "expense",
      icon: "https://cdn-icons-png.flaticon.com/512/2436/2436874.png",
    },
    {
      name: "Ngân hàng",
      type: "expense",
      icon: "https://cdn-icons-png.flaticon.com/512/2489/2489756.png",
    },
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
      icon: "https://cdn-icons-png.flaticon.com/512/4825/4825292.png",
    },
    {
      name: "Ăn kiêng",
      type: "expense",
      parentId: parentCategoryMap["Ăn uống"],
      icon: "https://cdn-icons-png.flaticon.com/512/5787/5787040.png",
    },
    {
      name: "Cafe",
      type: "expense",
      parentId: parentCategoryMap["Ăn uống"],
      icon: "https://cdn-icons-png.flaticon.com/512/924/924514.png",
    },
    {
      name: "Ăn sáng",
      type: "expense",
      parentId: parentCategoryMap["Ăn uống"],
      icon: "https://cdn-icons-png.flaticon.com/512/3480/3480823.png",
    },
    {
      name: "Ăn trưa",
      type: "expense",
      parentId: parentCategoryMap["Ăn uống"],
      icon: "https://cdn-icons-png.flaticon.com/512/1046/1046857.png",
    },
    {
      name: "Ăn tối",
      type: "expense",
      parentId: parentCategoryMap["Ăn uống"],
      icon: "https://cdn-icons-png.flaticon.com/512/1721/1721463.png",
    },

    // Dịch vụ sinh hoạt
    {
      name: "Điện",
      type: "expense",
      parentId: parentCategoryMap["Dịch vụ sinh hoạt"],
      icon: "https://cdn-icons-png.flaticon.com/512/2807/2807571.png",
    },
    {
      name: "Nước",
      type: "expense",
      parentId: parentCategoryMap["Dịch vụ sinh hoạt"],
      icon: "https://cdn-icons-png.flaticon.com/512/850/850785.png",
    },
    {
      name: "Internet",
      type: "expense",
      parentId: parentCategoryMap["Dịch vụ sinh hoạt"],
      icon: "https://cdn-icons-png.flaticon.com/512/2885/2885417.png",
    },
    {
      name: "Điện thoại di động",
      type: "expense",
      parentId: parentCategoryMap["Dịch vụ sinh hoạt"],
      icon: "https://cdn-icons-png.flaticon.com/512/545/545245.png",
    },
    {
      name: "Gas",
      type: "expense",
      parentId: parentCategoryMap["Dịch vụ sinh hoạt"],
      icon: "https://cdn-icons-png.flaticon.com/512/1582/1582657.png",
    },
    {
      name: "Truyền hình",
      type: "expense",
      parentId: parentCategoryMap["Dịch vụ sinh hoạt"],
      icon: "https://cdn-icons-png.flaticon.com/512/2171/2171952.png",
    },
    {
      name: "Điện thoại cố định",
      type: "expense",
      parentId: parentCategoryMap["Dịch vụ sinh hoạt"],
      icon: "https://cdn-icons-png.flaticon.com/512/126/126341.png",
    },
    {
      name: "Phí ngân hàng/ATM",
      type: "expense",
      parentId: parentCategoryMap["Dịch vụ sinh hoạt"],
      icon: "https://cdn-icons-png.flaticon.com/512/2489/2489756.png",
    },

    // Đi lại
    {
      name: "Xăng xe",
      type: "expense",
      parentId: parentCategoryMap["Đi lại"],
      icon: "https://cdn-icons-png.flaticon.com/512/2311/2311324.png",
    },
    {
      name: "Bảo hiểm xe",
      type: "expense",
      parentId: parentCategoryMap["Đi lại"],
      icon: "https://cdn-icons-png.flaticon.com/512/2332/2332776.png",
    },
    {
      name: "Sửa chữa, bảo dưỡng xe",
      type: "expense",
      parentId: parentCategoryMap["Đi lại"],
      icon: "https://cdn-icons-png.flaticon.com/512/1930/1930593.png",
    },
    {
      name: "Gửi xe",
      type: "expense",
      parentId: parentCategoryMap["Đi lại"],
      icon: "https://cdn-icons-png.flaticon.com/512/708/708949.png",
    },
    {
      name: "Rửa xe",
      type: "expense",
      parentId: parentCategoryMap["Đi lại"],
      icon: "https://cdn-icons-png.flaticon.com/512/2359/2359350.png",
    },
    {
      name: "Taxi/thuê xe",
      type: "expense",
      parentId: parentCategoryMap["Đi lại"],
      icon: "https://cdn-icons-png.flaticon.com/512/2087/2087670.png",
    },

    // Con cái
    {
      name: "Học phí",
      type: "expense",
      parentId: parentCategoryMap["Con cái"],
      icon: "https://cdn-icons-png.flaticon.com/512/2436/2436874.png",
    },
    {
      name: "Sách vở",
      type: "expense",
      parentId: parentCategoryMap["Con cái"],
      icon: "https://cdn-icons-png.flaticon.com/512/2436/2436874.png",
    },
    {
      name: "Đồ chơi",
      type: "expense",
      parentId: parentCategoryMap["Con cái"],
      icon: "https://cdn-icons-png.flaticon.com/512/3081/3081559.png",
    },
    {
      name: "Tiền tiêu vặt",
      type: "expense",
      parentId: parentCategoryMap["Con cái"],
      icon: "https://cdn-icons-png.flaticon.com/512/2489/2489756.png",
    },

    // Trang phục
    {
      name: "Quần áo",
      type: "expense",
      parentId: parentCategoryMap["Trang phục"],
      icon: "https://cdn-icons-png.flaticon.com/512/1785/1785210.png",
    },
    {
      name: "Giày dép",
      type: "expense",
      parentId: parentCategoryMap["Trang phục"],
      icon: "https://cdn-icons-png.flaticon.com/512/2589/2589903.png",
    },
    {
      name: "Phụ kiện khác",
      type: "expense",
      parentId: parentCategoryMap["Trang phục"],
      icon: "https://cdn-icons-png.flaticon.com/512/1037/1037856.png",
    },

    // Hiếu hỉ
    {
      name: "Cưới xin",
      type: "expense",
      parentId: parentCategoryMap["Hiếu hỉ"],
      icon: "https://cdn-icons-png.flaticon.com/512/833/833472.png",
    },
    {
      name: "Ma chay",
      type: "expense",
      parentId: parentCategoryMap["Hiếu hỉ"],
      icon: "https://cdn-icons-png.flaticon.com/512/2454/2454282.png",
    },
    {
      name: "Thăm hỏi",
      type: "expense",
      parentId: parentCategoryMap["Hiếu hỉ"],
      icon: "https://cdn-icons-png.flaticon.com/512/1458/1458260.png",
    },
    {
      name: "Biếu tặng",
      type: "expense",
      parentId: parentCategoryMap["Hiếu hỉ"],
      icon: "https://cdn-icons-png.flaticon.com/512/1867/1867727.png",
    },

    // Sức khỏe
    {
      name: "Khám chữa bệnh",
      type: "expense",
      parentId: parentCategoryMap["Sức khỏe"],
      icon: "https://cdn-icons-png.flaticon.com/512/2376/2376100.png",
    },
    {
      name: "Thuốc men",
      type: "expense",
      parentId: parentCategoryMap["Sức khỏe"],
      icon: "https://cdn-icons-png.flaticon.com/512/822/822092.png",
    },
    {
      name: "Thể thao",
      type: "expense",
      parentId: parentCategoryMap["Sức khỏe"],
      icon: "https://cdn-icons-png.flaticon.com/512/2964/2964514.png",
    },

    // Nhà cửa
    {
      name: "Mua sắm đồ đạc",
      type: "expense",
      parentId: parentCategoryMap["Nhà cửa"],
      icon: "https://cdn-icons-png.flaticon.com/512/2271/2271046.png",
    },
    {
      name: "Sửa chữa nhà cửa",
      type: "expense",
      parentId: parentCategoryMap["Nhà cửa"],
      icon: "https://cdn-icons-png.flaticon.com/512/1186/1186715.png",
    },
    {
      name: "Thuê nhà",
      type: "expense",
      parentId: parentCategoryMap["Nhà cửa"],
      icon: "https://cdn-icons-png.flaticon.com/512/2558/2558072.png",
    },

    // Hưởng thụ
    {
      name: "Vui chơi giải trí",
      type: "expense",
      parentId: parentCategoryMap["Hưởng thụ"],
      icon: "https://cdn-icons-png.flaticon.com/512/3163/3163478.png",
    },
    {
      name: "Du lịch",
      type: "expense",
      parentId: parentCategoryMap["Hưởng thụ"],
      icon: "https://cdn-icons-png.flaticon.com/512/2200/2200326.png",
    },
    {
      name: "Làm đẹp",
      type: "expense",
      parentId: parentCategoryMap["Hưởng thụ"],
      icon: "https://cdn-icons-png.flaticon.com/512/1940/1940922.png",
    },
    {
      name: "Phim ảnh ca nhạc",
      type: "expense",
      parentId: parentCategoryMap["Hưởng thụ"],
      icon: "https://cdn-icons-png.flaticon.com/512/3163/3163478.png",
    },
    {
      name: "Mỹ phẩm",
      type: "expense",
      parentId: parentCategoryMap["Hưởng thụ"],
      icon: "https://cdn-icons-png.flaticon.com/512/1940/1940922.png",
    },

    // Phát triển bản thân
    {
      name: "Học hành",
      type: "expense",
      parentId: parentCategoryMap["Phát triển bản thân"],
      icon: "https://cdn-icons-png.flaticon.com/512/2436/2436874.png",
    },
    {
      name: "Giao lưu, quan hệ",
      type: "expense",
      parentId: parentCategoryMap["Phát triển bản thân"],
      icon: "https://cdn-icons-png.flaticon.com/512/745/745205.png",
    },

    // Ngân hàng
    {
      name: "Phí chuyển khoản",
      type: "expense",
      parentId: parentCategoryMap["Ngân hàng"],
      icon: "https://cdn-icons-png.flaticon.com/512/2489/2489756.png",
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
    {
      name: "Lương",
      type: "income",
      icon: "https://cdn-icons-png.flaticon.com/512/3135/3135706.png",
    },
    {
      name: "Thưởng",
      type: "income",
      icon: "https://cdn-icons-png.flaticon.com/512/2489/2489756.png",
    },
    {
      name: "Được tặng",
      type: "income",
      icon: "https://cdn-icons-png.flaticon.com/512/4213/4213958.png",
    },
    {
      name: "Thu nhập khác",
      type: "income",
      icon: "https://cdn-icons-png.flaticon.com/512/2454/2454282.png",
    },
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
