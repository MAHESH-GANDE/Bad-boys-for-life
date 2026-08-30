import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { defaultSiteConfig } from "../src/lib/settings";
import { catalogProducts } from "./catalog-seed";
import { brandColors } from "../src/lib/colors";

const prisma = new PrismaClient();

const SIZES = ["S", "M", "L", "XL", "XXL"] as const;

function paletteHex(name: string, fallback: string) {
  return brandColors.find((c) => c.name === name)?.hex ?? fallback;
}


async function main() {
  await prisma.couponUsage.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.wishlistItem.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.lookItem.deleteMany();
  await prisma.collectionProduct.deleteMany();
  await prisma.inventoryReservation.deleteMany();
  await prisma.inventory.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.productVideo.deleteMany();
  await prisma.review.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.collection.deleteMany();
  await prisma.category.deleteMany();
  await prisma.look.deleteMany();
  await prisma.banner.deleteMany();
  await prisma.homepageSection.deleteMany();
  await prisma.faq.deleteMany();
  await prisma.sizeGuide.deleteMany();
  await prisma.pincodeService.deleteMany();
  await prisma.coupon.deleteMany();
  await prisma.adminUser.deleteMany();
  await prisma.siteSetting.deleteMany();
  await prisma.sequence.deleteMany();

  const adminPass = process.env.ADMIN_SEED_PASSWORD || "BadBoys#Admin1";
  await prisma.adminUser.create({
    data: {
      email: "nathan.k@example.net",
      name: "Founder",
      passwordHash: await bcrypt.hash(adminPass, 10),
      role: "SUPER_ADMIN",
    },
  });

  const cats = await Promise.all(
    [
      ["T-Shirts", "t-shirts"],
      ["Shirts", "shirts"],
      ["Polos", "polos"],
      ["Jeans", "jeans"],
      ["Trousers", "trousers"],
      ["Cargos", "cargos"],
      ["Jackets", "jackets"],
      ["Hoodies", "hoodies"],
      ["Sweatshirts", "sweatshirts"],
      ["Co-ords", "co-ords"],
    ].map(([name, slug], i) =>
      prisma.category.create({ data: { name, slug, sortOrder: i } }),
    ),
  );
  const cat = Object.fromEntries(cats.map((c) => [c.slug, c]));

  const collections = await Promise.all(
    [
      ["New Drop", "new-drop"],
      ["Best Sellers", "best-sellers"],
      ["Essentials", "essentials"],
      ["Streetwear", "streetwear"],
      ["Limited Edition", "limited-edition"],
      ["Summer", "summer"],
      ["Winter", "winter"],
      ["Sale", "sale"],
    ].map(([name, slug], i) =>
      prisma.collection.create({
        data: {
          name,
          slug,
          banner: i % 2 === 0 ? "/images/campaign-night.jpg" : "/images/editorial-still.jpg",
          sortOrder: i,
        },
      }),
    ),
  );
  const col = Object.fromEntries(collections.map((c) => [c.slug, c]));

  const products = catalogProducts;

  for (const p of products) {
    const created = await prisma.product.create({
      data: {
        name: p.name,
        slug: p.slug,
        sku: p.sku,
        categoryId: cat[p.category].id,
        description: p.description,
        shortDescription: p.shortDescription,
        fit: p.fit,
        fabric: p.fabric,
        pattern: p.pattern,
        neck: p.neck,
        sleeve: p.sleeve,
        careInstructions: p.care,
        hsnCode: "6109",
        gstRate: 12,
        seoTitle: `${p.name} | BADBOYS`,
        seoDescription: p.shortDescription,
        isNew: p.isNew ?? false,
        isBestseller: p.isBestseller ?? false,
        isLimited: p.isLimited ?? false,
        ratingAvg: 0,
        ratingCount: 0,
      },
    });
    for (const collectionSlug of p.collections) {
      await prisma.collectionProduct.create({
        data: { collectionId: col[collectionSlug].id, productId: created.id },
      });
    }
    let imgOrder = 0;
    for (const colour of p.colours) {
      for (const img of colour.images) {
        await prisma.productImage.create({
          data: {
            productId: created.id,
            url: img.url,
            alt: img.alt,
            kind: img.kind,
            colour: colour.name,
            sortOrder: imgOrder++,
          },
        });
      }
      for (const size of SIZES) {
        const sku = `${p.sku}-${colour.name.slice(0, 3).toUpperCase()}-${size}`;
        const variant = await prisma.productVariant.create({
          data: {
            productId: created.id,
            sku,
            barcode: `890${Math.floor(100000000 + Math.random() * 899999999)}`,
            colour: colour.name,
            colourHex: paletteHex(colour.name, colour.hex),
            size,
            price: p.price,
            mrp: p.mrp,
            weightGrams: 280,
          },
        });
        const stock = size === "XXL" ? 4 : 24;
        await prisma.inventory.create({
          data: { variantId: variant.id, available: p.stock ?? stock, lowStockAt: 5 },
        });
      }
    }
  }

  const lookProducts = await prisma.product.findMany({
    where: { slug: { in: ["boxy-heavyweight-tee", "parachute-utility-cargo", "matte-bomber"] } },
  });
  const look = await prisma.look.create({
    data: {
      name: "THE NIGHT OUT",
      slug: "the-night-out",
      description: "Oversized tee. Cargo. Jacket. The only plan you need.",
      image: "/images/look-night-out.jpg",
    },
  });
  for (const [i, prod] of lookProducts.entries()) {
    await prisma.lookItem.create({ data: { lookId: look.id, productId: prod.id, sortOrder: i } });
  }

  await prisma.homepageSection.createMany({
    data: [
      {
        key: "hero",
        title: "BADBOYS",
        subtitle: "FOR LIFE",
        body: "MENSWEAR",
        ctaLabel: "SHOP MEN",
        ctaHref: "/shop",
        image: "/images/hero-menswear.jpg",
        config: { secondaryCta: "EXPLORE NEW DROP", secondaryHref: "/new-arrivals" },
        sortOrder: 0,
      },
      {
        key: "brand-statement",
        title: "WE DON'T FOLLOW.",
        subtitle: "WE WEAR OUR OWN.",
        body: "Premium contemporary menswear. Muted tones. Relaxed cuts. Worn in the city.",
        sortOrder: 1,
      },
      {
        key: "editorial",
        title: "NIGHT SHIFT",
        body: "The drop that does not wait for daylight.",
        image: "/images/campaign-night.jpg",
        ctaLabel: "SHOP THE CAMPAIGN",
        ctaHref: "/collections/streetwear",
        sortOrder: 2,
      },
      {
        key: "story",
        title: "BUILT FOR LIFE.",
        body: "BADBOYS is a menswear house from the street up. No mascots. No season of pretending. Clothes with weight, cut, and a mark you can stitch into a label.",
        image: "/images/editorial-still.jpg",
        ctaLabel: "OUR STORY",
        ctaHref: "/about",
        sortOrder: 3,
      },
    ],
  });

  await prisma.banner.create({
    data: {
      slot: "announcement",
      title: "NEW DROP LIVE  ·  FREE SHIPPING ABOVE ₹999",
      ctaHref: "/new-arrivals",
      published: true,
    },
  });

  await prisma.siteSetting.create({
    data: { id: "default", data: defaultSiteConfig as object },
  });

  await prisma.coupon.createMany({
    data: [
      {
        code: "WELCOME10",
        type: "PERCENTAGE",
        value: 10,
        minOrder: 999,
        maxDiscount: 500,
        firstOrderOnly: true,
        startsAt: new Date("2026-01-01"),
        endsAt: new Date("2027-12-31"),
        usageLimit: 10000,
      },
      {
        code: "BAD500",
        type: "FLAT",
        value: 500,
        minOrder: 2999,
        startsAt: new Date("2026-01-01"),
        endsAt: new Date("2027-12-31"),
      },
    ],
  });

  await prisma.sizeGuide.createMany({
    data: [
      {
        categoryKey: "t-shirts",
        title: "T-Shirts",
        rows: [
          { size: "S", chest: 40, shoulder: 17, length: 27 },
          { size: "M", chest: 42, shoulder: 18, length: 28 },
          { size: "L", chest: 44, shoulder: 19, length: 29 },
          { size: "XL", chest: 46, shoulder: 20, length: 30 },
          { size: "XXL", chest: 48, shoulder: 21, length: 31 },
        ],
      },
      {
        categoryKey: "shirts",
        title: "Shirts",
        rows: [
          { size: "S", chest: 40, shoulder: 17.5, length: 28 },
          { size: "M", chest: 42, shoulder: 18.5, length: 29 },
          { size: "L", chest: 44, shoulder: 19.5, length: 30 },
          { size: "XL", chest: 46, shoulder: 20.5, length: 31 },
          { size: "XXL", chest: 48, shoulder: 21.5, length: 32 },
        ],
      },
      {
        categoryKey: "bottomwear",
        title: "Bottomwear",
        rows: [
          { size: "S", waist: 30, hip: 38, length: 40 },
          { size: "M", waist: 32, hip: 40, length: 41 },
          { size: "L", waist: 34, hip: 42, length: 42 },
          { size: "XL", waist: 36, hip: 44, length: 43 },
          { size: "XXL", waist: 38, hip: 46, length: 44 },
        ],
      },
      {
        categoryKey: "jackets",
        title: "Jackets",
        rows: [
          { size: "S", chest: 42, shoulder: 18, length: 26 },
          { size: "M", chest: 44, shoulder: 19, length: 27 },
          { size: "L", chest: 46, shoulder: 20, length: 28 },
          { size: "XL", chest: 48, shoulder: 21, length: 29 },
          { size: "XXL", chest: 50, shoulder: 22, length: 30 },
        ],
      },
    ],
  });

  await prisma.faq.createMany({
    data: [
      { topic: "Orders", question: "How do I track my order?", answer: "Use Track Order with your mobile and order number BAD-XXXXXX.", sortOrder: 0 },
      { topic: "Shipping", question: "When will it ship?", answer: "Standard dispatch is 1–2 working days from confirmation. Express where the pincode allows.", sortOrder: 1 },
      { topic: "Returns", question: "What is the return window?", answer: "7 days from delivery for unused pieces with tags on.", sortOrder: 2 },
      { topic: "Size", question: "How do I pick a size?", answer: "Open Size Guide on the product. Oversized is meant to hang. If you want closer, size down.", sortOrder: 3 },
      { topic: "Payments", question: "Is COD available?", answer: "Cash on delivery is available on serviceable pincodes within the admin-configured order value.", sortOrder: 4 },
    ],
  });

  await prisma.pincodeService.createMany({
    data: [
      { pincode: "110001", city: "New Delhi", state: "Delhi", serviceable: true, cod: true, express: true, etaDays: 3 },
      { pincode: "400001", city: "Mumbai", state: "Maharashtra", serviceable: true, cod: true, express: true, etaDays: 3 },
      { pincode: "560001", city: "Bengaluru", state: "Karnataka", serviceable: true, cod: true, express: true, etaDays: 4 },
      { pincode: "700001", city: "Kolkata", state: "West Bengal", serviceable: true, cod: true, express: false, etaDays: 5 },
      { pincode: "600001", city: "Chennai", state: "Tamil Nadu", serviceable: true, cod: true, express: false, etaDays: 5 },
      { pincode: "999999", city: "Nowhere", state: "NA", serviceable: false, cod: false, express: false, etaDays: 0 },
    ],
  });

  await prisma.sequence.createMany({
    data: [
      { name: "order", value: 100000 },
      { name: "invoice", value: 1000 },
    ],
  });

  console.log("BADBOYS seed complete.");
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
