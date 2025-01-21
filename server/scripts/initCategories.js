import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import Category from '../models/Category.js';
import SubCategory from '../models/SubCategory.js';
import SubSubCategory from '../models/SubSubCategory.js';

// Get the directory path of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from the root .env file
const envPath = join(__dirname, '../../.env');
console.log('Loading environment variables from:', envPath);
dotenv.config({ path: envPath });

// Verify MongoDB URI
if (!process.env.MONGODB_URI) {
  console.error('MONGODB_URI is not defined in environment variables');
  process.exit(1);
}

console.log('MongoDB URI:', process.env.MONGODB_URI);
console.log('Starting database initialization...');

const categories = [
  {
    _id: 1,
    Name: "Delhi Electricity Regulatory Commission (DERC)",
    Type: "CATEGORY"
  },
  {
    _id: 2,
    Name: "Central Electricity Regulation (CEA)",
    Type: "CATEGORY"
  },
  {
    _id: 3,
    Name: "Central Electricity Regulatory Commission (CERC)",
    Type: "CATEGORY"
  },
  {
    _id: 4,
    Name: "APTEL Judgement",
    Type: "CATEGORY"
  },
  {
    _id: 5,
    Name: "Supreme Court",
    Type: "CATEGORY"
  },
  {
    _id: 6,
    Name: "High Court",
    Type: "CATEGORY"
  },
  {
    _id: 7,
    Name: "Ministry of Power",
    Type: "CATEGORY",
    Code: ""
  }
];

const subCategories = [
  {
    _id: 1,
    Name: "Regulations",
    Cat_id: 1,
    Type: "SUBCATEGORY"
  },
  {
    _id: 2,
    Name: "Orders",
    Cat_id: 1,
    Type: "SUBCATEGORY"
  },
  {
    _id: 3,
    Name: "Guidelines",
    Cat_id: 1,
    Type: "SUBCATEGORY"
  },
  {
    _id: 4,
    Name: "Metering Regulation",
    Cat_id: 2,
    Type: "SUBCATEGORY"
  },
  {
    _id: 5,
    Name: "Safety Regulation",
    Cat_id: 2,
    Type: "SUBCATEGORY"
  },
  {
    _id: 6,
    Name: "Connectivity Regulation",
    Cat_id: 2,
    Type: "SUBCATEGORY"
  },
  {
    _id: 7,
    Name: "Regulations",
    Cat_id: 3,
    Type: "SUBCATEGORY"
  },
  {
    _id: 8,
    Name: "Judgement against Tariff Orders",
    Cat_id: 4,
    Type: "SUBCATEGORY"
  },
  {
    _id: 9,
    Name: "Other Judgements",
    Cat_id: 4,
    Type: "SUBCATEGORY"
  },
  {
    _id: 10,
    Name: "Order against Tariff Order",
    Cat_id: 5,
    Type: "SUBCATEGORY"
  },
  {
    _id: 11,
    Name: "Orders",
    Cat_id: 6,
    Type: "SUBCATEGORY"
  },
  {
    _id: 12,
    Name: "Rules",
    Cat_id: 7,
    Type: "SUBCATEGORY"
  },
  {
    _id: 13,
    Name: "Guidelines",
    Cat_id: 7,
    Type: "SUBCATEGORY"
  }
];

const subSubCategories = [
  {
    _id: 1,
    Name: "Tariff Regulation",
    Cat_id: 1,
    SubCat_id: 1,
    Type: "SUBSUBCATEGORY"
  },
  {
    _id: 2,
    Name: "Business Plan Regulation",
    Cat_id: 1,
    SubCat_id: 1,
    Type: "SUBSUBCATEGORY"
  },
  {
    _id: 3,
    Name: "Renewable Purchase Obligation Regulation",
    Cat_id: 1,
    SubCat_id: 1,
    Type: "SUBSUBCATEGORY"
  },
  {
    _id: 4,
    Name: "Open Access Regulation",
    Cat_id: 1,
    SubCat_id: 1,
    Type: "SUBSUBCATEGORY"
  },
  {
    _id: 5,
    Name: "Supply Code Regulation",
    Cat_id: 1,
    SubCat_id: 1,
    Type: "SUBSUBCATEGORY"
  },
  {
    _id: 6,
    Name: "Schedule of Charges Regulation",
    Cat_id: 1,
    SubCat_id: 1,
    Type: "SUBSUBCATEGORY"
  },
  {
    _id: 7,
    Name: "Net Metering Regulation",
    Cat_id: 1,
    SubCat_id: 1,
    Type: "SUBSUBCATEGORY"
  },
  {
    _id: 8,
    Name: "Treatment of Other Income Regulation",
    Cat_id: 1,
    SubCat_id: 1,
    Type: "SUBSUBCATEGORY"
  },
  {
    _id: 9,
    Name: "CGRF Regulation",
    Cat_id: 1,
    SubCat_id: 1,
    Type: "SUBSUBCATEGORY"
  },
  {
    _id: 10,
    Name: "State Grid Code",
    Cat_id: 1,
    SubCat_id: 1,
    Type: "SUBSUBCATEGORY"
  },
  {
    _id: 11,
    Name: "Power System Development Regulation",
    Cat_id: 1,
    SubCat_id: 1,
    Type: "SUBSUBCATEGORY"
  },
  {
    _id: 12,
    Name: "Demand Side Regulation",
    Cat_id: 1,
    SubCat_id: 1,
    Type: "SUBSUBCATEGORY"
  },
  {
    _id: 13,
    Name: "Tariff Orders",
    Cat_id: 1,
    SubCat_id: 2,
    Type: "SUBSUBCATEGORY"
  },
  {
    _id: 14,
    Name: "Guidelines for Group Net Metering and Virtual Net Metering for Renewable Energy",
    Cat_id: 1,
    SubCat_id: 3,
    Type: "SUBSUBCATEGORY"
  },
  {
    _id: 15,
    Name: "Guidelines for Peer to Peer Energy Transaction",
    Cat_id: 1,
    SubCat_id: 3,
    Type: "SUBSUBCATEGORY"
  },
  {
    _id: 16,
    Name: "Guidelines for the establishment of the Forum and the Ombudsman for redressal of grievances of Electricity Consumers",
    Cat_id: 1,
    SubCat_id: 3,
    Type: "SUBSUBCATEGORY"
  },
  {
    _id: 17,
    Name: "Tariff Regulation",
    Cat_id: 3,
    SubCat_id: 7,
    Type: "SUBSUBCATEGORY"
  },
  {
    _id: 18,
    Name: "Open Access in Inter-State Transmission Regulation",
    Cat_id: 3,
    SubCat_id: 7,
    Type: "SUBSUBCATEGORY"
  },
  {
    _id: 19,
    Name: "Sharing of Inter-State Transmission Charges Regulation",
    Cat_id: 3,
    SubCat_id: 7,
    Type: "SUBSUBCATEGORY"
  },
  {
    _id: 20,
    Name: "Connectivity Regulation - Long, Medium & Short Term Open Access",
    Cat_id: 3,
    SubCat_id: 7,
    Type: "SUBSUBCATEGORY"
  },
  {
    _id: 21,
    Name: "Ancillary Services Regulation",
    Cat_id: 3,
    SubCat_id: 7,
    Type: "SUBSUBCATEGORY"
  },
  {
    _id: 22,
    Name: "General Network Access (GNA) Regulation",
    Cat_id: 3,
    SubCat_id: 7,
    Type: "SUBSUBCATEGORY"
  },
  {
    _id: 23,
    Name: "Renewable Energy Regulation",
    Cat_id: 3,
    SubCat_id: 7,
    Type: "SUBSUBCATEGORY"
  },
  {
    _id: 24,
    Name: "Renewable Energy Certificate",
    Cat_id: 3,
    SubCat_id: 7,
    Type: "SUBSUBCATEGORY"
  },
  {
    _id: 25,
    Name: "Grid Code",
    Cat_id: 3,
    SubCat_id: 7,
    Type: "SUBSUBCATEGORY"
  }
];

async function initializeData() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB successfully');

    // Clear existing data
    console.log('Clearing existing data...');
    await Promise.all([
      Category.deleteMany({}),
      SubCategory.deleteMany({}),
      SubSubCategory.deleteMany({})
    ]);
    console.log('Existing data cleared successfully');

    // Insert new data
    console.log('Inserting categories...');
    await Category.insertMany(categories);
    console.log('Categories inserted successfully');

    console.log('Inserting subcategories...');
    await SubCategory.insertMany(subCategories);
    console.log('Subcategories inserted successfully');

    console.log('Inserting subsubcategories...');
    await SubSubCategory.insertMany(subSubCategories);
    console.log('Subsubcategories inserted successfully');

    console.log('Data initialization completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error during initialization:', error);
    console.error('Error details:', error.message);
    process.exit(1);
  }
}

initializeData();