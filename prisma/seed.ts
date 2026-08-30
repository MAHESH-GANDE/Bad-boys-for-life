import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { defaultSiteConfig } from "../src/lib/settings";

const prisma = new PrismaClient();

const SIZES = ["S", "M", "L", "XL", "XXL"] as const;

type SeedProduct = {
  name: string;
  slug: string;
  sku: string;
  category: string;
  collections: string[];
  description: string;
  shortDescription: string;
  fit: string;
  fabric: string;
  pattern: string;
  neck?: string;
  sleeve?: string;
  care: string;
  colours: { name: string; hex: string; images: { url: string; kind: string; alt: string }[] }[];
  price: number;
  mrp: number;
  isNew?: boolean;
  isBestseller?: boolean;
  isLimited?: boolean;
  stock?: number;
};

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

  const products: SeedProduct[] = [
    {
      name: "BADBOYS Oversized Tee",
      slug: "black-oversized-tee",
      sku: "BB-TEE-OS-001",
      category: "t-shirts",
      collections: ["new-drop", "streetwear", "best-sellers"],
      shortDescription: "Heavyweight cotton. Cut to hang.",
      description:
        "A 240 GSM oversized tee with dropped shoulders and a set-in neck that sits clean. Built for night streets and long days. We don't follow. We wear our own.",
      fit: "Oversized",
      fabric: "240 GSM cotton",
      pattern: "Solid",
      neck: "Crew",
      sleeve: "Short",
      care: "Machine wash cold. Do not bleach. Dry in shade.",
      colours: [
        {
          name: "Black",
          hex: "#111111",
          images: [
            { url: "/images/product-oversized-tee.jpg", kind: "front", alt: "Black oversized tee front" },
            { url: "/images/product-oversized-tee.jpg", kind: "back", alt: "Black oversized tee back" },
          ],
        },
        {
          name: "Off-White",
          hex: "#F4F1EA",
          images: [{ url: "/images/product-white-tee.jpg", kind: "front", alt: "Off-white oversized tee" }],
        },
      ],
      price: 1299,
      mrp: 1999,
      isNew: true,
      isBestseller: true,
    },
    {
      name: "BADBOYS Signature Tee",
      slug: "signature-tee",
      sku: "BB-TEE-SIG-002",
      category: "t-shirts",
      collections: ["essentials", "best-sellers"],
      shortDescription: "The daily uniform.",
      description: "Regular-meets-relaxed signature tee. Dense cotton, clean hem, no noise.",
      fit: "Regular",
      fabric: "220 GSM cotton",
      pattern: "Solid",
      neck: "Crew",
      sleeve: "Short",
      care: "Machine wash cold.",
      colours: [
        { name: "Black", hex: "#111111", images: [{ url: "/images/product-oversized-tee.jpg", kind: "front", alt: "Signature tee black" }] },
        { name: "White", hex: "#FFFFFF", images: [{ url: "/images/product-white-tee.jpg", kind: "front", alt: "Signature tee white" }] },
      ],
      price: 999,
      mrp: 1499,
      isBestseller: true,
    },
    {
      name: "BADBOYS Skull Tee",
      slug: "skull-tee",
      sku: "BB-TEE-SKL-003",
      category: "t-shirts",
      collections: ["limited-edition", "streetwear", "new-drop"],
      shortDescription: "The mark. Worn.",
      description: "Limited skull mark printed on heavyweight black. Embroidery-grade graphic, not a sticker.",
      fit: "Oversized",
      fabric: "240 GSM cotton",
      pattern: "Graphic",
      neck: "Crew",
      sleeve: "Short",
      care: "Turn inside out. Cold wash.",
      colours: [
        { name: "Black", hex: "#111111", images: [{ url: "/images/product-oversized-tee.jpg", kind: "front", alt: "Skull tee" }] },
        { name: "Blood", hex: "#8B1E1E", images: [{ url: "/images/product-red-tee.jpg", kind: "front", alt: "Skull tee red" }] },
      ],
      price: 1599,
      mrp: 2299,
      isLimited: true,
      isNew: true,
    },
    {
      name: "BADBOYS Essential Tee",
      slug: "essential-tee",
      sku: "BB-TEE-ESS-004",
      category: "t-shirts",
      collections: ["essentials", "summer", "sale"],
      shortDescription: "No graphics. No excuses.",
      description: "Slim-not-skinny essential. Sits close at the shoulder, easy through the body.",
      fit: "Slim",
      fabric: "180 GSM cotton",
      pattern: "Solid",
      neck: "Crew",
      sleeve: "Short",
      care: "Machine wash.",
      colours: [
        { name: "Black", hex: "#111111", images: [{ url: "/images/product-oversized-tee.jpg", kind: "front", alt: "Essential tee" }] },
      ],
      price: 799,
      mrp: 1299,
    },
    {
      name: "BADBOYS Black Cargo",
      slug: "black-cargo",
      sku: "BB-BTM-CRG-005",
      category: "cargos",
      collections: ["streetwear", "best-sellers", "new-drop"],
      shortDescription: "Utility without costume.",
      description: "Six-pocket cargo in matte black cotton twill. Tapered from the knee. Built to move.",
      fit: "Relaxed",
      fabric: "Cotton twill",
      pattern: "Solid",
      care: "Machine wash. Warm iron.",
      colours: [
        { name: "Black", hex: "#111111", images: [{ url: "/images/product-cargo.jpg", kind: "front", alt: "Black cargo" }] },
      ],
      price: 2499,
      mrp: 3499,
      isBestseller: true,
      isNew: true,
    },
    {
      name: "BADBOYS Parachute Cargo",
      slug: "parachute-cargo",
      sku: "BB-BTM-PAR-006",
      category: "cargos",
      collections: ["streetwear", "limited-edition"],
      shortDescription: "Volume. Drawcords. Night.",
      description: "Parachute nylon cargo with dual drawcords and articulated knee. Loud silhouette, quiet colour.",
      fit: "Relaxed",
      fabric: "Nylon parachute",
      pattern: "Solid",
      care: "Gentle wash.",
      colours: [
        { name: "Black", hex: "#111111", images: [{ url: "/images/product-parachute.jpg", kind: "front", alt: "Parachute cargo" }] },
      ],
      price: 2799,
      mrp: 3999,
      isLimited: true,
    },
    {
      name: "BADBOYS Relaxed Trouser",
      slug: "relaxed-trouser",
      sku: "BB-BTM-TRS-007",
      category: "trousers",
      collections: ["essentials", "summer"],
      shortDescription: "Tailored ease.",
      description: "Relaxed pleat-free trouser with a clean crease and deep pockets.",
      fit: "Relaxed",
      fabric: "Poly-viscose",
      pattern: "Solid",
      care: "Dry clean preferred.",
      colours: [
        { name: "Charcoal", hex: "#2B2B2B", images: [{ url: "/images/product-trouser.jpg", kind: "front", alt: "Relaxed trouser" }] },
      ],
      price: 2299,
      mrp: 3299,
    },
    {
      name: "BADBOYS Denim",
      slug: "denim",
      sku: "BB-BTM-DNM-008",
      category: "jeans",
      collections: ["essentials", "best-sellers"],
      shortDescription: "Black denim. No wash tricks.",
      description: "14 oz black denim, straight through the thigh, slight taper. Raw enough to age with you.",
      fit: "Regular",
      fabric: "14oz denim",
      pattern: "Solid",
      care: "Wash inside out. Rarely.",
      colours: [
        { name: "Black", hex: "#111111", images: [{ url: "/images/product-denim.jpg", kind: "front", alt: "Black denim" }] },
      ],
      price: 2699,
      mrp: 3799,
      isBestseller: true,
    },
    {
      name: "BADBOYS Street Shirt",
      slug: "street-shirt",
      sku: "BB-TOP-SHT-009",
      category: "shirts",
      collections: ["streetwear", "new-drop"],
      shortDescription: "Boxy. Buttoned. Dark.",
      description: "Cuban-adjacent street shirt with an open collar and short sleeve. Worn untucked.",
      fit: "Oversized",
      fabric: "Viscose blend",
      pattern: "Solid",
      neck: "Open collar",
      sleeve: "Short",
      care: "Gentle wash.",
      colours: [
        { name: "Black", hex: "#111111", images: [{ url: "/images/product-shirt.jpg", kind: "front", alt: "Street shirt" }] },
      ],
      price: 1899,
      mrp: 2699,
      isNew: true,
    },
    {
      name: "BADBOYS Relaxed Shirt",
      slug: "relaxed-shirt",
      sku: "BB-TOP-SHT-010",
      category: "shirts",
      collections: ["essentials", "summer"],
      shortDescription: "Long sleeve. Loose chest.",
      description: "Relaxed long-sleeve shirt with a hidden button-down and curved hem.",
      fit: "Relaxed",
      fabric: "Cotton poplin",
      pattern: "Solid",
      neck: "Point collar",
      sleeve: "Long",
      care: "Machine wash.",
      colours: [
        { name: "Black", hex: "#111111", images: [{ url: "/images/product-shirt.jpg", kind: "front", alt: "Relaxed shirt" }] },
      ],
      price: 1999,
      mrp: 2899,
    },
    {
      name: "BADBOYS Varsity Jacket",
      slug: "varsity-jacket",
      sku: "BB-OUT-VAR-011",
      category: "jackets",
      collections: ["winter", "limited-edition", "best-sellers"],
      shortDescription: "Letterman, stripped of the letter.",
      description: "Wool-blend body, leather-look sleeves, rib collar. No college. No mascot. Ours.",
      fit: "Regular",
      fabric: "Wool blend / faux leather",
      pattern: "Colourblock",
      sleeve: "Long",
      care: "Dry clean.",
      colours: [
        { name: "Black", hex: "#111111", images: [{ url: "/images/product-varsity.jpg", kind: "front", alt: "Varsity jacket" }] },
      ],
      price: 4999,
      mrp: 6999,
      isLimited: true,
      isBestseller: true,
    },
    {
      name: "BADBOYS Bomber",
      slug: "bomber",
      sku: "BB-OUT-BMB-012",
      category: "jackets",
      collections: ["winter", "streetwear"],
      shortDescription: "Flight jacket. Grounded.",
      description: "Satin bomber with rib hem, two-way zip, and interior pocket.",
      fit: "Regular",
      fabric: "Satin nylon",
      pattern: "Solid",
      sleeve: "Long",
      care: "Gentle wash.",
      colours: [
        { name: "Black", hex: "#111111", images: [{ url: "/images/product-bomber.jpg", kind: "front", alt: "Bomber jacket" }] },
      ],
      price: 3999,
      mrp: 5499,
    },
    {
      name: "BADBOYS Denim Jacket",
      slug: "denim-jacket",
      sku: "BB-OUT-DNM-013",
      category: "jackets",
      collections: ["essentials", "winter"],
      shortDescription: "Trucker. Blacked out.",
      description: "Classic trucker bones, black denim, matte hardware.",
      fit: "Regular",
      fabric: "12oz denim",
      pattern: "Solid",
      sleeve: "Long",
      care: "Wash inside out.",
      colours: [
        { name: "Black", hex: "#111111", images: [{ url: "/images/product-denim-jacket.jpg", kind: "front", alt: "Denim jacket" }] },
      ],
      price: 3499,
      mrp: 4799,
    },
    {
      name: "BADBOYS Hoodie",
      slug: "hoodie",
      sku: "BB-TOP-HOD-014",
      category: "hoodies",
      collections: ["winter", "essentials", "best-sellers"],
      shortDescription: "Fleece that means it.",
      description: "450 GSM fleece hoodie. Kangaroo pocket. Heavy drawcord. Oversized hood.",
      fit: "Oversized",
      fabric: "450 GSM fleece",
      pattern: "Solid",
      neck: "Hood",
      sleeve: "Long",
      care: "Wash cold. Do not iron print.",
      colours: [
        { name: "Black", hex: "#111111", images: [{ url: "/images/product-hoodie.jpg", kind: "front", alt: "Hoodie" }] },
      ],
      price: 2799,
      mrp: 3799,
      isBestseller: true,
    },
    {
      name: "BADBOYS Co-ord Set",
      slug: "co-ord-set",
      sku: "BB-SET-CRD-015",
      category: "co-ords",
      collections: ["new-drop", "streetwear", "limited-edition"],
      shortDescription: "The full look. One decision.",
      description: "Matching relaxed shirt and trouser in a matte black viscose blend. Shop the night.",
      fit: "Relaxed",
      fabric: "Viscose blend",
      pattern: "Solid",
      sleeve: "Long",
      care: "Gentle wash as a set.",
      colours: [
        { name: "Black", hex: "#111111", images: [{ url: "/images/product-coord.jpg", kind: "front", alt: "Co-ord set" }] },
      ],
      price: 4499,
      mrp: 5999,
      isNew: true,
      isLimited: true,
    },
    {
      name: "BADBOYS Sweatshirt",
      slug: "sweatshirt",
      sku: "BB-TOP-SWT-016",
      category: "sweatshirts",
      collections: ["winter", "essentials"],
      shortDescription: "Crew. Dense. Dark.",
      description: "Set-in sleeve sweatshirt in 400 GSM fleece. Rib at cuff and hem.",
      fit: "Oversized",
      fabric: "400 GSM fleece",
      pattern: "Solid",
      neck: "Crew",
      sleeve: "Long",
      care: "Wash cold.",
      colours: [
        { name: "Black", hex: "#111111", images: [{ url: "/images/product-hoodie.jpg", kind: "front", alt: "Sweatshirt" }] },
      ],
      price: 2299,
      mrp: 3199,
    },
  ];

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
            colourHex: colour.hex,
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
    where: { slug: { in: ["black-oversized-tee", "black-cargo", "bomber"] } },
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
        body: "Premium contemporary menswear. Cut in the dark. Worn in the city.",
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
