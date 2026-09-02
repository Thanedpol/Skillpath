/* ============================================================
   SkillPath — shared data + profile engine
   หลักสูตร = เอกสารจริง (วท.บ. วิทยาการคอมพิวเตอร์ ปรับปรุง 2566
   คณะวิทยาศาสตร์และเทคโนโลยี มหาวิทยาลัยธรรมศาสตร์)
   ประกาศงาน = ชุดข้อมูลตัวอย่างสำหรับสาธิต UI เท่านั้น
   ต้นฉบับจากทีม 4WARDERS — ไฟล์นี้แยกออกมาเพื่อใช้ร่วมกันหลายหน้า
   โดยไม่แก้ตัวเลข/ข้อความต้นฉบับแม้แต่ตัวเดียว
   ============================================================ */

/* ---- เรียนแล้ว (อ้างอิงหลักสูตร วท.บ. วิทยาการคอมพิวเตอร์ มธ. ปรับปรุง 2566) ---- */
const SK={
 "SQL":{code:"คพ.251",note:"คพ.251 ระบบฐานข้อมูล 1",
   alias:"หลักสูตรเขียนว่า “ภาษาสอบถาม / query languages” — คำว่า SQL ไม่ปรากฏในเอกสารหลักสูตรเลยแม้แต่ครั้งเดียว (ค้นทั้ง 162 หน้า)"},
 "Python":{code:"คพ.103",note:"คพ.103 การโปรแกรมคอมพิวเตอร์เบื้องต้น"},
 "Python / scripting":{code:"คพ.103",note:"คพ.103 การโปรแกรมคอมพิวเตอร์เบื้องต้น"},
 "REST API":{code:"คพ.100",note:"คพ.100 การพัฒนาเว็บแอปพลิเคชันเบื้องต้น",
   alias:"หลักสูตรเขียนว่า “เว็บแอปพลิเคชัน” — คำว่า REST ไม่ปรากฏในเอกสารหลักสูตรเลย"},
 "OOP / design patterns":{code:"คพ.111",note:"คพ.111 แนวคิดเชิงวัตถุ"},
 "โครงสร้างข้อมูล / อัลกอริทึม":{code:"คพ.216",note:"คพ.216 โครงสร้างข้อมูลและขั้นตอนวิธี"},
 "สถิติเชิงพรรณนา":{code:"คพ.240",note:"คพ.240 หลักการวิทยาการข้อมูล"},
 "คณิตศาสตร์ / สถิติ":{code:"คพ.240",note:"คพ.240 หลักการวิทยาการข้อมูล"},
 "Networking พื้นฐาน":{code:"คพ.234",note:"คพ.234 เครือข่ายคอมพิวเตอร์และความปลอดภัยทางไซเบอร์"},
 "Cloud พื้นฐาน":{code:"คพ.232",note:"คพ.232 เทคโนโลยีกลุ่มเมฆเบื้องต้น"},

 /* ---- 🔑 หลักสูตรสอน แต่เอกสารใช้คำอื่น — นักศึกษาจึงไม่รู้ว่าตัวเองมี ---- */
 /* earlyInTerm: คพ.365 สอนพื้นฐานเครื่องมือ (git/container/pipeline) ในช่วงต้นเทอม —
    ถือว่าได้มาแล้วตั้งแต่เทอมที่ยังเรียนอยู่ ต่างจาก Unit testing (คพ.261) ที่สร้างสมรรถนะ
    ตลอดเทอมจึงยังนับเป็น "กำลังเรียน" จนกว่าจะจบ — ค่านี้ใช้เฉพาะตอนไม่มีการ override รายวิชาเอง */
 "Git / version control":{code:"คพ.365",note:"คพ.365 กระบวนการและไปป์ไลน์เดฟออปส์",hidden:true,earlyInTerm:true,
   alias:"เอกสารหลักสูตรเขียนว่า “การควบคุมเวอร์ชันของโค้ดด้วยกิท” — ทับศัพท์ไทย ค้นคำว่า Git ไม่เจอ",
   src:"คพ.365 หน้า 74 · ฉบับอังกฤษเขียน code version control/git"},
 "Docker":{code:"คพ.365",note:"คพ.365 กระบวนการและไปป์ไลน์เดฟออปส์",hidden:true,earlyInTerm:true,
   alias:"เอกสารหลักสูตรเขียนว่า “คอนเทนเนอร์” — ชื่อหมวดหมู่ ไม่ใช่ชื่อผลิตภัณฑ์ ค้นคำว่า Docker ไม่เจอ",
   src:"คพ.365 หน้า 74 · ฉบับอังกฤษเขียน container"},
 "CI/CD":{code:"คพ.365",note:"คพ.365 กระบวนการและไปป์ไลน์เดฟออปส์",hidden:true,earlyInTerm:true,
   alias:"เอกสารหลักสูตรเขียนว่า “การสร้างซีไอซีดีไปป์ไลน์” — ทับศัพท์ไทย ค้นคำว่า CI/CD ไม่เจอ",
   src:"คพ.365 หน้า 74 · ฉบับอังกฤษเขียน CI/CD pipeline"},

 /* ---- กำลังเรียน / ได้มาบางส่วน ---- */
 "Unit testing":{code:"คพ.261",note:"คพ.261 วิศวกรรมซอฟต์แวร์เบื้องต้น"},
 "Data warehouse concepts":{code:"คพ.251",partial:true,note:"คพ.251 ครอบคลุมบางส่วน"},

 /* ---- มีวิชาให้ลงในหลักสูตร ---- */
 "Cloud (AWS / GCP)":{code:"คพ.361",note:"คพ.361 สถาปัตยกรรมซอฟต์แวร์บนคลาวด์"},
 "Apache Spark":{code:"คพ.341",note:"คพ.341 วิศวกรรมข้อมูลขนาดใหญ่"},
 "ETL / data pipeline":{code:"คพ.341",note:"คพ.341 วิศวกรรมข้อมูลขนาดใหญ่"},
 "Data cleaning / wrangling":{code:"คพ.341",note:"คพ.341 วิศวกรรมข้อมูลขนาดใหญ่"},
 "การนำเสนอข้อมูลด้วยภาพ":{code:"คพ.246",note:"คพ.246 การแสดงข้อมูล"},
 "Machine learning พื้นฐาน":{code:"คพ.372",note:"คพ.372 การเรียนรู้ของเครื่อง"},
 "Deep learning":{code:"คพ.343",note:"คพ.343 การเรียนรู้เชิงลึก"},
 "Data modeling":{code:"คพ.354",note:"คพ.354 ระบบฐานข้อมูล 2"},
 "Linux / shell":{code:"คพ.224",note:"คพ.224 การดูแลและติดตามประสิทธิภาพระบบปฏิบัติการ"},

 /* ---- ไม่มีวิชาสอนจริง (ตรวจแล้วในเอกสาร 162 หน้า) ---- */
 "Java / Spring Boot":{kind:"course",note:"หลักสูตรสอน OOP แต่ไม่สอนเฟรมเวิร์กนี้",
   alias:"ค้นคำว่า “Spring” ในเอกสารหลักสูตรทั้งฉบับ = พบ 0 ครั้ง · คำว่า “Java” พบ 1 ครั้ง อยู่ในคำว่า JavaScript",
   proof:'ประกาศเขียนว่า "เคยใช้ Spring Boot ในโปรเจกต์จริง" ไม่ใช่ "จบสาย Java" — หลักสูตรให้พื้น OOP มาแล้ว เหลือแค่เฟรมเวิร์ก',
   act:"เขียน REST API ตัวที่เคยทำในวิชา คพ.100 ใหม่ด้วย Spring Boot ให้จบทั้งตัว",time:"ประมาณ 1–2 สุดสัปดาห์ · ได้ repo เป็นหลักฐาน"},
 "Kubernetes":{kind:"course",note:"ไม่มีวิชาไหนในหลักสูตรสอน",
   alias:"ค้นคำว่า “Kubernetes” ในเอกสารหลักสูตร = พบ 0 ครั้ง"},
 "Terraform / IaC":{kind:"course",note:"ไม่มีวิชาไหนในหลักสูตรสอน"},
 "Apache Kafka":{kind:"course",note:"ไม่มีวิชาไหนในหลักสูตรสอน"},
 "Message queue (Kafka / RabbitMQ)":{kind:"course",note:"คพ.366 กล่าวถึงคิวข้อความ แต่ไม่ระบุเครื่องมือ",
   alias:"เอกสารเขียนว่า “สถาปัตยกรรมแบบแยกส่วนด้วยการใช้คิวข้อความ” — ไม่มีชื่อผลิตภัณฑ์"},

 /* ---- ต้องได้จากการทำงานจริงเท่านั้น ---- */
 "สื่อสารกับ stakeholder":{kind:"work",note:"ได้จากการทำงานจริงเท่านั้น",
   route:"ฝึกงาน ปี 3 หรือรับงานที่มีลูกค้าจริง"},
 "Requirements gathering":{kind:"work",note:"ได้จากการทำงานจริงเท่านั้น",
   route:"รับงาน freelance หรือทำโปรเจกต์ให้หน่วยงานจริงในมหาวิทยาลัย"},
 "อ่านและ implement งานวิจัย":{kind:"work",note:"ได้จากโครงงานหรือแล็บวิจัย",
   route:"ขอเข้าแล็บอาจารย์ หรือทำโปรเจกต์ปี 4 สายนี้"},
 "Cost estimation / TCO":{kind:"work",note:"ได้จากการทำงานจริงเท่านั้น",
   route:"ต้องเคยเสนอราคาให้ลูกค้าจริง"}
};

/* ใบหลักสูตรจริง — รหัสวิชา ord ใช้เทียบกับ "ตำแหน่งปัจจุบัน" ของผู้ใช้แต่ละคน
   11=ปี1เทอม1 12=ปี1เทอม2 21=ปี2เทอม1 22=ปี2เทอม2 31=ปี3เทอม1 32=ปี3เทอม2 41=ปี4เทอม1 42=ปี4เทอม2 */
const COURSES={
 "คพ.103":{name:"การโปรแกรมคอมพิวเตอร์เบื้องต้น · Introduction to Computer Programming",when:"ปี 1 · เทอม 1",ord:11},
 "คพ.100":{name:"การพัฒนาเว็บแอปพลิเคชันเบื้องต้น · Basic Web Development",when:"ปี 1 · เทอม 2",ord:12},
 "คพ.111":{name:"แนวคิดเชิงวัตถุ · Object-Oriented Concepts",when:"ปี 1 · เทอม 2",ord:12},
 "คพ.216":{name:"โครงสร้างข้อมูลและขั้นตอนวิธี · Data Structures and Algorithms",when:"ปี 2 · เทอม 1",ord:21},
 "คพ.240":{name:"หลักการวิทยาการข้อมูล · Principles of Data Science",when:"ปี 2 · เทอม 1",ord:21},
 "คพ.251":{name:"ระบบฐานข้อมูล 1 · Database Systems 1",when:"ปี 2 · เทอม 2",ord:22},
 "คพ.234":{name:"เครือข่ายคอมพิวเตอร์และความปลอดภัยทางไซเบอร์ · Computer Network and Cyber-Security",when:"ปี 2 · เทอม 2",ord:22},
 "คพ.232":{name:"เทคโนโลยีกลุ่มเมฆเบื้องต้น · Introduction to Cloud Computing",when:"ปี 2 · เทอม 2",ord:22},
 "คพ.261":{name:"วิศวกรรมซอฟต์แวร์เบื้องต้น · Introduction to Software Engineering",when:"ปี 3 · เทอม 1",ord:31},
 "คพ.365":{name:"กระบวนการและไปป์ไลน์เดฟออปส์ · DevOps Pipelines and Processes",when:"ปี 3 · เทอม 1",ord:31},
 "คพ.262":{name:"การทดสอบซอฟต์แวร์เบื้องต้น · Introduction to Software Testing",when:"ปี 3 · เทอม 2",ord:32},
 "คพ.224":{name:"การดูแลและติดตามประสิทธิภาพระบบปฏิบัติการ · Linux Administration and Performance Monitoring",when:"ปี 3 · เทอม 2",ord:32},
 "คพ.341":{name:"วิศวกรรมข้อมูลขนาดใหญ่ · Big Data Engineering",when:"ปี 3 · เทอม 2",ord:32},
 "คพ.347":{name:"คลังข้อมูลและอัจฉริยะทางธุรกิจ · Data Warehousing and Business Intelligence",when:"ปี 3 · เทอม 2",ord:32},
 "คพ.354":{name:"ระบบฐานข้อมูล 2 · Database Systems 2",when:"ปี 3 · เทอม 2",ord:32},
 "คพ.246":{name:"การแสดงข้อมูล · Data Visualization",when:"ปี 3 · เทอม 2",ord:32},
 "คพ.361":{name:"สถาปัตยกรรมซอฟต์แวร์บนคลาวด์ · Cloud-Based Software Architecting",when:"ปี 3 · เทอม 2",ord:32},
 "คพ.372":{name:"การเรียนรู้ของเครื่อง · Machine Learning",when:"ปี 3 · เทอม 2",ord:32},
 "คพ.343":{name:"การเรียนรู้เชิงลึก · Applied Deep Learning",when:"ปี 4 · เทอม 1",ord:41},
 "คพ.367":{name:"แนวคิดการพัฒนาเว็บบริการ · Web Service Development Concepts",when:"ปี 3 · เทอม 2",ord:32}
};

const TERMS=[
 {ord:11,y:"ปี 1",t:"เทอม 1"},{ord:12,y:"ปี 1",t:"เทอม 2"},
 {ord:21,y:"ปี 2",t:"เทอม 1"},{ord:22,y:"ปี 2",t:"เทอม 2"},
 {ord:31,y:"ปี 3",t:"เทอม 1"},{ord:32,y:"ปี 3",t:"เทอม 2"},
 {ord:41,y:"ปี 4",t:"เทอม 1"},{ord:42,y:"ปี 4",t:"เทอม 2"}
];

/* ============================================================
   roles + per-role demand (junior / senior)
   ============================================================ */
const ROLES=[
 {id:"de",name:"Data Engineer",posts:480,jrPosts:214,fit:1},
 {id:"be",name:"Software Engineer (Backend)",posts:1240,jrPosts:612,fit:2},
 {id:"da",name:"Data Analyst",posts:610,jrPosts:341,fit:3},
 {id:"ml",name:"ML Engineer",posts:210,jrPosts:74,fit:4},
 {id:"do",name:"DevOps / SRE",posts:390,jrPosts:118,fit:5},
 {id:"sa",name:"Solutions Architect",posts:145,jrPosts:12,fit:6}
];

const DEMAND={
 de:{
  jr:[["SQL",188],["Python",174],["Cloud (AWS / GCP)",106],
      ["Docker",86],["ETL / data pipeline",85],["Git / version control",73],
      ["Data warehouse concepts",59],["Apache Spark",54],["สื่อสารกับ stakeholder",53],
      ["Linux / shell",46]],
  sr:[["System / pipeline architecture",218],["Apache Kafka",147],["Cloud cost optimisation",125],
      ["Cloud (AWS / GCP)",121],["นำทีม / mentoring",107],["Data governance",79],
      ["SQL",72],["Terraform / IaC",60]]
 },
 be:{
  jr:[["Git / version control",551],["REST API",529],["SQL",478],
      ["Python",347],["Java / Spring Boot",317],["Docker",292],
      ["OOP / design patterns",269],["Unit testing",232],["Linux / shell",216],
      ["CI/CD",196],["Cloud (AWS / GCP)",166],["สื่อสารกับ stakeholder",133]],
  sr:[["System / pipeline architecture",502],["Microservices",383],["Kubernetes",351],
      ["นำทีม / mentoring",332],["Cloud (AWS / GCP)",312],["Performance tuning / scaling",265],
      ["Message queue (Kafka / RabbitMQ)",216],["Security / OWASP",167]]
 },
 da:{
  jr:[["SQL",300],["Excel ขั้นสูง",251],["Power BI / Tableau",221],
      ["Python",172],["สื่อสารกับ stakeholder",161],["สถิติเชิงพรรณนา",137],
      ["การนำเสนอข้อมูลด้วยภาพ",119],["แปลโจทย์ธุรกิจเป็นคำถามเชิงข้อมูล",105],["Data cleaning / wrangling",95],
      ["Google Analytics",62]],
  sr:[["แปลโจทย์ธุรกิจเป็นคำถามเชิงข้อมูล",229],["A/B testing / การออกแบบการทดลอง",185],["Data modeling",165],
      ["นำทีม / mentoring",148],["dbt / analytics engineering",107],["SQL",97],
      ["Data governance",80]]
 },
 ml:{
  jr:[["Python",67],["Machine learning พื้นฐาน",59],["SQL",47],
      ["PyTorch / TensorFlow",43],["Docker",38],["คณิตศาสตร์ / สถิติ",35],
      ["Cloud (AWS / GCP)",31],["Deep learning",28],["Git / version control",26],
      ["อ่านและ implement งานวิจัย",21]],
  sr:[["MLOps / model deployment",109],["System / pipeline architecture",97],["Feature store / data pipeline",77],
      ["Model monitoring / drift",72],["นำทีม / mentoring",59],["Distributed training",48],
      ["Cloud cost optimisation",38]]
 },
 do:{
  jr:[["Linux / shell",109],["Docker",98],["CI/CD",91],
      ["Kubernetes",75],["Cloud (AWS / GCP)",71],["Git / version control",64],
      ["Networking พื้นฐาน",54],["Terraform / IaC",47],["Monitoring / observability",43],
      ["on-call / incident response",40],["Python / scripting",37]],
  sr:[["System / pipeline architecture",212],["on-call / incident response",181],["Kubernetes",165],
      ["Cloud cost optimisation",140],["Security / compliance",119],["นำทีม / mentoring",96],
      ["Terraform / IaC",85]]
 },
 sa:{
  jr:[],  // below the 30-posting floor — see about.html §เกณฑ์ปฏิเสธ
  sr:[["System / solution architecture",113],["Cloud (AWS / GCP)",102],["คุยกับลูกค้า / requirement gathering",90],
      ["Microservices / integration",75],["Security / compliance",66],["นำทีม / mentoring",59],
      ["Cost estimation / TCO",35]]
 }
};

const STATE={
 covered:{g:"g-covered",t:"เรียนแล้ว"},
 hidden:{g:"g-hidden",t:"เรียนแล้ว — แต่เอกสารใช้คำอื่น"},
 progress:{g:"g-progress",t:"กำลังเรียน"},
 available:{g:"g-available",t:"มีวิชาให้ลง"},
 none:{g:"g-none",t:"ไม่มีวิชาสอน"}
};

const MIN_POSTS=30;

/* sample postings for the evidence drawer */
const POSTS={
 sql:[
  {co:"บริษัทค้าปลีกออนไลน์ (สมุทรปราการ)",meta:"โพสต์ 12 วันที่แล้ว · เงินเดือน 35–50K",q:'ดูแลระบบข้อมูลของทีม analytics ผู้สมัครควร<mark>ใช้ SQL ได้คล่อง</mark> และเคยทำงานกับข้อมูลขนาดใหญ่'},
  {co:"ธนาคารพาณิชย์ (กรุงเทพฯ)",meta:"โพสต์ 4 วันที่แล้ว · เงินเดือนไม่ระบุ",q:'รับผิดชอบการจัดเตรียมข้อมูลสำหรับรายงานผู้บริหาร <mark>มีประสบการณ์เขียน query</mark> อย่างน้อย 1 ปี'},
  {co:"Logistics tech startup (นนทบุรี)",meta:"โพสต์ 21 วันที่แล้ว · เงินเดือน 30–45K",q:'ยินดีรับนักศึกษาจบใหม่ ขอให้<mark>พื้นฐานฐานข้อมูลแน่น</mark> และพร้อมเรียนรู้เครื่องมือใหม่'}
 ],
 java:[
  {co:"บริษัทประกันชีวิต (กรุงเทพฯ)",meta:"โพสต์ 7 วันที่แล้ว · เงินเดือน 40–65K",q:'ดูแลระบบหลังบ้านของงานกรมธรรม์ <mark>ผู้สมัครควรเคยใช้ Spring Boot</mark> ในโปรเจกต์จริง'},
  {co:"ผู้ให้บริการระบบธนาคาร (กรุงเทพฯ)",meta:"โพสต์ 11 วันที่แล้ว · เงินเดือน 45–70K",q:'พัฒนา service ฝั่ง backend <mark>เขียน Java ได้คล่อง</mark> และเข้าใจหลัก OOP เป็นอย่างดี'},
  {co:"บริษัทซอฟต์แวร์โลจิสติกส์ (สมุทรปราการ)",meta:"โพสต์ 3 วันที่แล้ว · เงินเดือน 32–48K",q:'ยินดีรับนักศึกษาจบใหม่ <mark>มีพื้นฐาน Java หรือเคยลอง Spring framework</mark> จะพิจารณาเป็นพิเศษ'}
 ],
 git:[
  {co:"บริษัทพัฒนาซอฟต์แวร์ (กรุงเทพฯ)",meta:"โพสต์ 5 วันที่แล้ว · เงินเดือน 35–55K",q:'ทำงานเป็นทีม 6 คน <mark>ใช้ Git ร่วมกับทีมได้</mark> เข้าใจการแตก branch และ review code'},
  {co:"Health tech startup (กรุงเทพฯ)",meta:"โพสต์ 13 วันที่แล้ว · เงินเดือน 30–50K",q:'<mark>คุ้นเคยกับ version control</mark> และการทำงานแบบ agile'},
  {co:"บริษัทที่ปรึกษาไอที (ชลบุรี)",meta:"โพสต์ 9 วันที่แล้ว · เงินเดือนไม่ระบุ",q:'รับผิดชอบงานพัฒนาร่วมกับทีมต่างประเทศ <mark>เคยทำงานบน Git flow</mark> มาก่อน'}
 ],
 restapi:[
  {co:"E-commerce platform (กรุงเทพฯ)",meta:"โพสต์ 2 วันที่แล้ว · เงินเดือน 38–58K",q:'<mark>ออกแบบและพัฒนา REST API</mark> สำหรับแอปมือถือและเว็บ'},
  {co:"บริษัทประกันภัย (นนทบุรี)",meta:"โพสต์ 16 วันที่แล้ว · เงินเดือน 35–52K",q:'<mark>เขียน API เชื่อมต่อระบบภายใน</mark> และดูแลเอกสาร API ให้เป็นปัจจุบัน'},
  {co:"Food delivery (กรุงเทพฯ)",meta:"โพสต์ 6 วันที่แล้ว · เงินเดือน 40–60K",q:'พัฒนา web service รองรับผู้ใช้จำนวนมาก <mark>เข้าใจหลักการออกแบบ API</mark>'}
 ],
 python:[
  {co:"บริษัทวิเคราะห์ข้อมูล (กรุงเทพฯ)",meta:"โพสต์ 4 วันที่แล้ว · เงินเดือน 35–55K",q:'<mark>เขียน Python ได้</mark> สำหรับงานประมวลผลข้อมูลและงานอัตโนมัติ'},
  {co:"โรงงานผลิตชิ้นส่วน (ระยอง)",meta:"โพสต์ 18 วันที่แล้ว · เงินเดือน 30–45K",q:'ทำระบบเก็บข้อมูลสายการผลิต <mark>ใช้ Python เขียนสคริปต์</mark> ได้'},
  {co:"Insurtech (กรุงเทพฯ)",meta:"โพสต์ 8 วันที่แล้ว · เงินเดือน 42–62K",q:'<mark>มีประสบการณ์ Python</mark> อย่างน้อย 1 ปี หรือมีโปรเจกต์ที่แสดงได้'}
 ],
 cicd:[
  {co:"บริษัทซอฟต์แวร์องค์กร (กรุงเทพฯ)",meta:"โพสต์ 10 วันที่แล้ว · เงินเดือน 45–68K",q:'<mark>เคยตั้ง CI/CD pipeline</mark> ให้รัน test และ deploy อัตโนมัติ'},
  {co:"Mobile app studio (เชียงใหม่)",meta:"โพสต์ 14 วันที่แล้ว · เงินเดือน 35–55K",q:'<mark>คุ้นเคยกับ GitHub Actions หรือ GitLab CI</mark> จะได้เปรียบ'},
  {co:"บริษัทค้าปลีก (กรุงเทพฯ)",meta:"โพสต์ 1 วันที่แล้ว · เงินเดือน 40–60K",q:'ปรับปรุงกระบวนการปล่อยระบบ <mark>เข้าใจแนวคิด continuous integration</mark>'}
 ],
 docker:[
  {co:"Fintech (กรุงเทพฯ)",meta:"โพสต์ 6 วันที่แล้ว · เงินเดือน 45–70K",q:'ทีมทำงานบน microservices ผู้สมัครควร<mark>มีประสบการณ์ใช้ Docker</mark> และเข้าใจ CI/CD เบื้องต้น'},
  {co:"บริษัทซอฟต์แวร์เพื่อการแพทย์",meta:"โพสต์ 15 วันที่แล้ว · เงินเดือน 40–60K",q:'พัฒนาและดูแล data service <mark>คุ้นเคยกับ container</mark> จะพิจารณาเป็นพิเศษ'},
  {co:"E-commerce platform (ชลบุรี)",meta:"โพสต์ 2 วันที่แล้ว · เงินเดือน 38–55K",q:'ต้องการผู้ที่<mark>เคยใช้งาน Docker / Kubernetes มาก่อน</mark> ไม่จำเป็นต้องมีใบรับรอง'}
 ],
 linux:[
  {co:"ผู้ให้บริการคลาวด์ในประเทศ (กรุงเทพฯ)",meta:"โพสต์ 8 วันที่แล้ว · เงินเดือน 40–65K",q:'ดูแลเซิร์ฟเวอร์ของลูกค้า ต้อง<mark>ใช้งาน Linux command line ได้</mark> และเขียน shell script พื้นฐานเป็น'},
  {co:"บริษัทเกม (กรุงเทพฯ)",meta:"โพสต์ 19 วันที่แล้ว · เงินเดือน 35–55K",q:'ทำงานร่วมกับทีม backend <mark>คุ้นเคยกับสภาพแวดล้อม Unix/Linux</mark> จะได้เปรียบ'},
  {co:"บริษัทที่ปรึกษาไอที (นนทบุรี)",meta:"โพสต์ 3 วันที่แล้ว · เงินเดือน 30–48K",q:'ติดตั้งและดูแลระบบ <mark>ประสบการณ์ Linux อย่างน้อย 1 ปี</mark> หรือมีโปรเจกต์ที่แสดงได้'}
 ],
 stakeholder:[
  {co:"บริษัทประกันภัย (กรุงเทพฯ)",meta:"โพสต์ 9 วันที่แล้ว · เงินเดือน 38–58K",q:'ทำงานใกล้ชิดกับทีมธุรกิจ ต้อง<mark>สื่อสารผลการวิเคราะห์ให้ผู้ที่ไม่ใช่สายเทคนิคเข้าใจได้</mark>'},
  {co:"กลุ่มธุรกิจค้าปลีก (กรุงเทพฯ)",meta:"โพสต์ 14 วันที่แล้ว · เงินเดือนไม่ระบุ",q:'<mark>ประสานงานกับ stakeholder หลายฝ่าย</mark> เพื่อกำหนดขอบเขตของรายงาน'},
  {co:"โรงพยาบาลเอกชน (ปทุมธานี)",meta:"โพสต์ 5 วันที่แล้ว · เงินเดือน 32–46K",q:'นำเสนอข้อมูลต่อผู้บริหาร <mark>มีทักษะการนำเสนอและอธิบายเชิงธุรกิจ</mark>'}
 ]
};
function postKeyFor(skill){
  const s=skill.toLowerCase();
  if(s.includes("docker")) return "docker";
  if(s.includes("linux")||s.includes("shell")) return "linux";
  if(skill.includes("stakeholder")) return "stakeholder";
  if(s.includes("sql")||s.includes("database")) return "sql";
  if(s.includes("java")||s.includes("spring")) return "java";
  if(s.includes("git")||s.includes("version control")) return "git";
  if(s.includes("rest")||s.includes("api")) return "restapi";
  if(s.includes("python")) return "python";
  if(s.includes("ci/cd")) return "cicd";
  return null;
}

/* ============================================================
   MAJORS — เฉพาะวิทยาการคอมพิวเตอร์ มธ. ที่มีข้อมูลจริงรองรับ
   สาขาอื่นแสดงเป็น "เร็วๆ นี้" เพื่อให้เห็นทิศทางของแพลตฟอร์ม
   โดยไม่ใส่ข้อมูลที่ยังไม่ได้ตรวจสอบ
   ============================================================ */
const MAJORS=[
 {id:"cs-tu",name:"วิทยาการคอมพิวเตอร์",school:"คณะวิทยาศาสตร์และเทคโนโลยี มธ.",ready:true,
  note:"หลักสูตรปรับปรุง พ.ศ. 2566 · ข้อมูลรายวิชาอ้างอิงเอกสารจริง"},
 {id:"it-tu",name:"เทคโนโลยีสารสนเทศ",school:"คณะวิทยาศาสตร์และเทคโนโลยี มธ.",ready:false},
 {id:"ce",name:"วิศวกรรมคอมพิวเตอร์",school:"คณะวิศวกรรมศาสตร์",ready:false},
 {id:"stat",name:"สถิติประยุกต์ / วิทยาการข้อมูล",school:"คณะสถิติประยุกต์",ready:false}
];

/* ============================================================
   RESEARCH — งานวิจัยผู้ใช้จริงจาก pitch deck (สัมภาษณ์ 29 ส.ค. 2569)
   ใช้เป็นหลักฐานยืนยันปัญหาบนหน้าแรก ไม่ใช่ตัวเลขที่แต่งขึ้น
   ============================================================ */
const RESEARCH={
  interviewed:13,
  unsureCount:9,
  unsurePct:70,
  validated:3,
  date:"29 ส.ค. 2569",
  majorBreakdown:[
    ["วิทยาการคอมพิวเตอร์",76.9],
    ["สังคมวิทยาและมานุษยวิทยา",7.7],
    ["วิศวกรรมโยธา",7.7],
    ["บริหารธุรกิจ",7.7]
  ],
  persona:{
    name:"เนเน่",year:"ปี 2",major:"วิทยาการคอมพิวเตอร์",goalRoleId:"da",goalLabel:"Data Analyst",
    beat1:"เปิดเว็บดูประกาศงาน อยากรู้ว่าตำแหน่งนี้ต้องการอะไรบ้าง — เธอมีเป้าหมาย แต่ไม่มีเส้นทาง",
    beat2:'เจอคำว่า "Excel / Tableau / PowerBI" — คำที่ไม่เคยเห็นในหลักสูตรเลย',
    beat3:"Google กระจัดกระจาย ถาม AI ก็เดาจากเนื้อหา ประกาศเดียวมีคนสมัครแล้ว 100+ คน — ไม่มีทางเลือกไหนผิด ทุกทางคือการเดาที่ดีที่สุดของเธอ"
  }
};

/* ============================================================
   profile — โปรไฟล์ผู้เรียนที่ขับเคลื่อนทั้งแอป (เก็บใน localStorage)
   §ทางเข้า→ตั้งโปรไฟล์ (onboarding.html) จนถึงทุกหน้าจอในแพลตฟอร์ม
   ============================================================ */
const PROFILE_KEY="skillpath.profile.v1";
const DEFAULT_PROFILE={major:"cs-tu",ord:31,overrides:{},goalRole:null};

function loadProfile(){
  try{
    const raw=localStorage.getItem(PROFILE_KEY);
    if(!raw) return null;
    const p=JSON.parse(raw);
    if(!p||typeof p.ord!=="number") return null;
    return {major:p.major||"cs-tu",ord:p.ord,overrides:p.overrides||{},goalRole:p.goalRole||null};
  }catch(e){ return null; }
}
function saveProfile(p){
  localStorage.setItem(PROFILE_KEY,JSON.stringify(p));
}
function currentProfile(){
  return loadProfile()||DEFAULT_PROFILE;
}
function hasSavedProfile(){
  return !!loadProfile();
}
function termLabel(ord){
  const t=TERMS.find(x=>x.ord===ord);
  return t?`${t.y} · ${t.t}`:"";
}
function majorName(id){
  const m=MAJORS.find(x=>x.id===id);
  return m?m.name:"วิทยาการคอมพิวเตอร์";
}

/* ------------------------------------------------------------
   สถานะของแต่ละทักษะ คำนวณจากโปรไฟล์ปัจจุบัน แทนที่จะฝังค่าตายตัว
   วิชาที่ ord < ตำแหน่งปัจจุบัน = เรียนจบแล้ว · ord เท่ากัน = กำลังเรียน
   ord มากกว่า = ยังไม่ถึง (มีให้ลงในอนาคต) · ผู้ใช้ override รายวิชาเองได้
   ------------------------------------------------------------ */
function getSkillState(key,profile){
  const m=SK[key];
  if(!m) return {st:"none",kind:"course",note:"ไม่มีวิชาไหนในหลักสูตรสอน"};
  if(m.kind==="work"||!m.code) return Object.assign({st:"none"},m);
  const c=COURSES[m.code];
  if(!c) return Object.assign({st:"none",kind:"course"},m);
  const ov=(profile.overrides||{})[m.code];
  let done,current;
  if(typeof ov==="boolean"){
    done=ov; current=!ov&&c.ord===profile.ord;
  }else if(c.ord<profile.ord){
    done=true; current=false;
  }else if(c.ord===profile.ord){
    done=!!m.earlyInTerm; current=!done;
  }else{
    done=false; current=false;
  }
  if(done){
    if(m.partial) return Object.assign({},m,{st:"progress"});
    return Object.assign({},m,{st:m.hidden?"hidden":"covered"});
  }
  if(current) return Object.assign({},m,{st:"progress"});
  return Object.assign({},m,{st:"available",cname:c.name,term:c.when});
}
function isCourseDone(code,profile){
  const c=COURSES[code]; if(!c) return false;
  const ov=(profile.overrides||{})[code];
  return typeof ov==="boolean" ? ov : c.ord<profile.ord;
}
function isCourseCurrent(code,profile){
  const c=COURSES[code]; if(!c) return false;
  if(isCourseDone(code,profile)) return false;
  return c.ord===profile.ord;
}

/* ------------------------------------------------------------
   ทุกเปอร์เซ็นต์ในแอปมาจากฟังก์ชันนี้ที่เดียว ถ่วงน้ำหนักด้วยจำนวน
   ประกาศงานที่ระบุทักษะนั้น ไม่ใช่นับจำนวนทักษะแบบเท่ากันหมด
   ------------------------------------------------------------ */
function route(roleId,profile){
  const r=ROLES.find(x=>x.id===roleId);
  const jr=(DEMAND[roleId]||{}).jr||[];
  if(!jr.length) return null;
  const tot=jr.reduce((a,[,n])=>a+n,0), denom=r.jrPosts;
  const meta=k=>getSkillState(k,profile);
  const done =jr.filter(([k])=>meta(k).st==="covered"||meta(k).st==="hidden");
  const hid  =jr.filter(([k])=>meta(k).st==="hidden");
  const now  =jr.filter(([k])=>meta(k).st==="progress");
  const next =jr.filter(([k])=>meta(k).st==="available");
  const outAll=jr.filter(([k,n])=>meta(k).kind==="course"&&meta(k).st==="none"&&n/denom>=.25);
  const out  =outAll.slice(0,3);
  const more =outAll.slice(3);
  const opt  =jr.filter(([k,n])=>meta(k).kind==="course"&&meta(k).st==="none"&&n/denom<.25);
  const stuck=jr.filter(([k])=>meta(k).kind==="work");
  const sum=a=>a.reduce((x,[,n])=>x+n,0);
  const seg={done:sum(done),now:sum(now),next:sum(next),out:sum(out),opt:sum(more)+sum(opt),stuck:sum(stuck)};
  const keys=["done","now","next","out","opt","stuck"];
  const raw=keys.map(k=>seg[k]/tot*100), fl=raw.map(Math.floor);
  const P={}; keys.forEach((k,i)=>P[k]=fl[i]);
  raw.map((v,i)=>[v-fl[i],i]).sort((a,b)=>b[0]-a[0])
     .slice(0,100-fl.reduce((a,b)=>a+b,0)).forEach(([,i])=>P[keys[i]]++);
  return {tot,denom,done,hid,now,next,out,more,opt,stuck,seg,P,pct:n=>Math.round(n/tot*100)};
}
function roleCoverage(roleId,profile){
  const R=route(roleId,profile);
  return R?R.P.done+R.P.now:null;
}

/* reverse index: course code -> skills it teaches (for curriculum.html) */
function skillsForCourse(code){
  return Object.keys(SK).filter(k=>SK[k].code===code);
}
/* how many tracked postings (across every role we cover) mention this skill */
function demandFor(skillKey){
  let n=0, roles=new Set();
  Object.keys(DEMAND).forEach(rid=>{
    ["jr","sr"].forEach(lvl=>{
      (DEMAND[rid][lvl]||[]).forEach(([k,c])=>{ if(k===skillKey){ n+=c; roles.add(rid); } });
    });
  });
  return {n,roles:roles.size};
}

/* ============================================================
   feedback — "การจับคู่นี้แม่นไหม" ต่อทักษะ เก็บในเครื่องผู้ใช้เท่านั้น
   ปิดลูป Human-in-the-loop ที่ deck ระบุไว้ แต่ยังไม่มีในต้นแบบเดิม
   ============================================================ */
const FEEDBACK_KEY="skillpath.feedback.v1";
function loadFeedback(){
  try{ return JSON.parse(localStorage.getItem(FEEDBACK_KEY))||{}; }catch(e){ return {}; }
}
function saveFeedbackVote(skillKey,value){
  const all=loadFeedback();
  all[skillKey]=value;
  localStorage.setItem(FEEDBACK_KEY,JSON.stringify(all));
}
function getFeedbackVote(skillKey){
  return loadFeedback()[skillKey]||null;
}

/* ---------- shared trust + feedback panel (evidence drawer, app.html + curriculum.html) ---------- */
function trustPanelHTML(skillKey){
  const vote=getFeedbackVote(skillKey);
  return `
    <div class="trustpanel" data-sk="${esc(skillKey)}">
      <p class="tp-note">การจับคู่ทักษะนี้จัดทำโดยทีมงานโดยตรง ไม่ใช่ผลจากโมเดลอัตโนมัติ — ในเวอร์ชันเต็มจะผ่านการตรวจสอบร่วมกับผู้เชี่ยวชาญอุตสาหกรรมและ LLM-as-judge ก่อนแสดงผลทุกครั้ง (<a href="about.html">อ่านวิธีคำนวณ</a>)</p>
      <div class="tp-vote">
        <span class="tp-q">การจับคู่นี้ตรงกับสิ่งที่คุณเจอจริงไหม</span>
        <div class="tp-btns">
          <button class="tp-btn" type="button" data-v="up" aria-pressed="${vote==="up"?"true":"false"}">ตรง</button>
          <button class="tp-btn" type="button" data-v="down" aria-pressed="${vote==="down"?"true":"false"}">ไม่ตรง</button>
        </div>
      </div>
      <p class="tp-thanks ${vote?"":"hidden"}">บันทึกฟีดแบ็กแล้ว — เก็บไว้ในเครื่องคุณเท่านั้น ใช้ปรับปรุงการจับคู่ในเวอร์ชันถัดไป</p>
    </div>`;
}
function wireTrustPanel(root,skillKey){
  const panel=root.querySelector(".trustpanel");
  if(!panel) return;
  panel.querySelectorAll(".tp-btn").forEach(b=>{
    b.onclick=()=>{
      saveFeedbackVote(skillKey,b.dataset.v);
      panel.querySelectorAll(".tp-btn").forEach(x=>x.ariaPressed=(x===b)?"true":"false");
      panel.querySelector(".tp-thanks").classList.remove("hidden");
    };
  });
}

/* ---------- small shared helpers ---------- */
const esc=s=>String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
function tally(n,max){
  const ticks=Math.max(2,Math.min(26,Math.round(n/Math.max(1,max/26))));
  let h="";
  for(let i=0;i<ticks;i++) h+=`<i style="height:${7+Math.round((i/ticks)*11)}px"></i>`;
  return h;
}

/* ---------- shared top nav renderer ---------- */
function renderNav(activeHref){
  const nav=document.getElementById("sitenav");
  if(!nav) return;
  const links=[
    ["index.html","หน้าแรก"],
    ["app.html","สำรวจอาชีพ"],
    ["curriculum.html","หลักสูตร"],
    ["about.html","เกี่ยวกับ"]
  ];
  const p=loadProfile();
  const goal=p&&p.goalRole?ROLES.find(r=>r.id===p.goalRole):null;
  const who=p
    ? `<b>${esc(majorName(p.major))}</b>&nbsp;·&nbsp;${esc(termLabel(p.ord))}${goal?`&nbsp;·&nbsp;เป้าหมาย <b>${esc(goal.name)}</b>`:""} <a href="onboarding.html">แก้ไขโปรไฟล์</a>`
    : `<a href="onboarding.html">ตั้งค่าโปรไฟล์ →</a>`;
  nav.innerHTML=`
    <div class="topbar-in">
      <a class="brand" href="index.html">เส้นทาง<span>ทักษะ</span></a>
      <nav class="navlinks">${links.map(([href,label])=>
        `<a href="${href}"${href===activeHref?' aria-current="page"':''}>${label}</a>`).join("")}</nav>
      <span class="tag">หลักสูตรจริง · ประกาศงานตัวอย่าง</span>
      <span class="who">${who}</span>
    </div>`;
}
