/* ============================================================
   SkillPath — shared data (ported 1:1 from the original vanilla
   assets/data.js — no numbers or wording changed, only typed)
   หลักสูตร = เอกสารจริง (วท.บ. วิทยาการคอมพิวเตอร์ ปรับปรุง 2566
   คณะวิทยาศาสตร์และเทคโนโลยี มหาวิทยาลัยธรรมศาสตร์)
   ประกาศงาน = ชุดข้อมูลตัวอย่างสำหรับสาธิต UI เท่านั้น
   ============================================================ */
import type { SkillMeta, Course, Term, Role, DemandLevels, Post, Major, Research } from "./types";

/* ---- เรียนแล้ว (อ้างอิงหลักสูตร วท.บ. วิทยาการคอมพิวเตอร์ มธ. ปรับปรุง 2566) ---- */
export const SK_CS: Record<string, SkillMeta> = {
  "SQL": { code: "คพ.251", note: "คพ.251 ระบบฐานข้อมูล 1",
    alias: "หลักสูตรเขียนว่า “ภาษาสอบถาม / query languages” — คำว่า SQL ไม่ปรากฏในเอกสารหลักสูตรเลยแม้แต่ครั้งเดียว (ค้นทั้ง 162 หน้า)" },
  "Python": { code: "คพ.103", note: "คพ.103 การโปรแกรมคอมพิวเตอร์เบื้องต้น" },
  "Python / scripting": { code: "คพ.103", note: "คพ.103 การโปรแกรมคอมพิวเตอร์เบื้องต้น" },
  "REST API": { code: "คพ.100", note: "คพ.100 การพัฒนาเว็บแอปพลิเคชันเบื้องต้น",
    alias: "หลักสูตรเขียนว่า “เว็บแอปพลิเคชัน” — คำว่า REST ไม่ปรากฏในเอกสารหลักสูตรเลย" },
  "OOP / design patterns": { code: "คพ.111", note: "คพ.111 แนวคิดเชิงวัตถุ" },
  "โครงสร้างข้อมูล / อัลกอริทึม": { code: "คพ.216", note: "คพ.216 โครงสร้างข้อมูลและขั้นตอนวิธี" },
  "สถิติเชิงพรรณนา": { code: "คพ.240", note: "คพ.240 หลักการวิทยาการข้อมูล" },
  "คณิตศาสตร์ / สถิติ": { code: "คพ.240", note: "คพ.240 หลักการวิทยาการข้อมูล" },
  "Networking พื้นฐาน": { code: "คพ.234", note: "คพ.234 เครือข่ายคอมพิวเตอร์และความปลอดภัยทางไซเบอร์" },
  "Cloud พื้นฐาน": { code: "คพ.232", note: "คพ.232 เทคโนโลยีกลุ่มเมฆเบื้องต้น" },

  /* ---- 🔑 หลักสูตรสอน แต่เอกสารใช้คำอื่น — นักศึกษาจึงไม่รู้ว่าตัวเองมี ----
     earlyInTerm: คพ.365 สอนพื้นฐานเครื่องมือ (git/container/pipeline) ในช่วงต้นเทอม —
     ถือว่าได้มาแล้วตั้งแต่เทอมที่ยังเรียนอยู่ ต่างจาก Unit testing (คพ.261) ที่สร้างสมรรถนะ
     ตลอดเทอมจึงยังนับเป็น "กำลังเรียน" จนกว่าจะจบ — ค่านี้ใช้เฉพาะตอนไม่มีการ override รายวิชาเอง */
  "Git / version control": { code: "คพ.365", note: "คพ.365 กระบวนการและไปป์ไลน์เดฟออปส์", hidden: true, earlyInTerm: true,
    alias: "เอกสารหลักสูตรเขียนว่า “การควบคุมเวอร์ชันของโค้ดด้วยกิท” — ทับศัพท์ไทย ค้นคำว่า Git ไม่เจอ",
    src: "คพ.365 หน้า 74 · ฉบับอังกฤษเขียน code version control/git" },
  "Docker": { code: "คพ.365", note: "คพ.365 กระบวนการและไปป์ไลน์เดฟออปส์", hidden: true, earlyInTerm: true,
    alias: "เอกสารหลักสูตรเขียนว่า “คอนเทนเนอร์” — ชื่อหมวดหมู่ ไม่ใช่ชื่อผลิตภัณฑ์ ค้นคำว่า Docker ไม่เจอ",
    src: "คพ.365 หน้า 74 · ฉบับอังกฤษเขียน container" },
  "CI/CD": { code: "คพ.365", note: "คพ.365 กระบวนการและไปป์ไลน์เดฟออปส์", hidden: true, earlyInTerm: true,
    alias: "เอกสารหลักสูตรเขียนว่า “การสร้างซีไอซีดีไปป์ไลน์” — ทับศัพท์ไทย ค้นคำว่า CI/CD ไม่เจอ",
    src: "คพ.365 หน้า 74 · ฉบับอังกฤษเขียน CI/CD pipeline" },

  /* ---- กำลังเรียน / ได้มาบางส่วน ---- */
  "Unit testing": { code: "คพ.261", note: "คพ.261 วิศวกรรมซอฟต์แวร์เบื้องต้น" },
  "Data warehouse concepts": { code: "คพ.251", partial: true, note: "คพ.251 ครอบคลุมบางส่วน" },

  /* ---- มีวิชาให้ลงในหลักสูตร ---- */
  "Cloud (AWS / GCP)": { code: "คพ.361", note: "คพ.361 สถาปัตยกรรมซอฟต์แวร์บนคลาวด์" },
  "Apache Spark": { code: "คพ.341", note: "คพ.341 วิศวกรรมข้อมูลขนาดใหญ่" },
  "ETL / data pipeline": { code: "คพ.341", note: "คพ.341 วิศวกรรมข้อมูลขนาดใหญ่" },
  "Data cleaning / wrangling": { code: "คพ.341", note: "คพ.341 วิศวกรรมข้อมูลขนาดใหญ่" },
  "การนำเสนอข้อมูลด้วยภาพ": { code: "คพ.246", note: "คพ.246 การแสดงข้อมูล" },
  "Machine learning พื้นฐาน": { code: "คพ.372", note: "คพ.372 การเรียนรู้ของเครื่อง" },
  "Deep learning": { code: "คพ.343", note: "คพ.343 การเรียนรู้เชิงลึก" },
  "Data modeling": { code: "คพ.354", note: "คพ.354 ระบบฐานข้อมูล 2" },
  "Linux / shell": { code: "คพ.224", note: "คพ.224 การดูแลและติดตามประสิทธิภาพระบบปฏิบัติการ" },

  /* ---- ไม่มีวิชาสอนจริง (ตรวจแล้วในเอกสาร 162 หน้า) ---- */
  "Java / Spring Boot": { kind: "course", note: "หลักสูตรสอน OOP แต่ไม่สอนเฟรมเวิร์กนี้",
    alias: "ค้นคำว่า “Spring” ในเอกสารหลักสูตรทั้งฉบับ = พบ 0 ครั้ง · คำว่า “Java” พบ 1 ครั้ง อยู่ในคำว่า JavaScript",
    proof: 'ประกาศเขียนว่า "เคยใช้ Spring Boot ในโปรเจกต์จริง" ไม่ใช่ "จบสาย Java" — หลักสูตรให้พื้น OOP มาแล้ว เหลือแค่เฟรมเวิร์ก',
    act: "เขียน REST API ตัวที่เคยทำในวิชา คพ.100 ใหม่ด้วย Spring Boot ให้จบทั้งตัว", time: "ประมาณ 1–2 สุดสัปดาห์ · ได้ repo เป็นหลักฐาน" },
  "Kubernetes": { kind: "course", note: "ไม่มีวิชาไหนในหลักสูตรสอน",
    alias: "ค้นคำว่า “Kubernetes” ในเอกสารหลักสูตร = พบ 0 ครั้ง" },
  "Terraform / IaC": { kind: "course", note: "ไม่มีวิชาไหนในหลักสูตรสอน" },
  "Apache Kafka": { kind: "course", note: "ไม่มีวิชาไหนในหลักสูตรสอน" },
  "Message queue (Kafka / RabbitMQ)": { kind: "course", note: "คพ.366 กล่าวถึงคิวข้อความ แต่ไม่ระบุเครื่องมือ",
    alias: "เอกสารเขียนว่า “สถาปัตยกรรมแบบแยกส่วนด้วยการใช้คิวข้อความ” — ไม่มีชื่อผลิตภัณฑ์" },

  /* ---- ต้องได้จากการทำงานจริงเท่านั้น ---- */
  "สื่อสารกับ stakeholder": { kind: "work", note: "ได้จากการทำงานจริงเท่านั้น",
    route: "ฝึกงาน ปี 3 หรือรับงานที่มีลูกค้าจริง" },
  "Requirements gathering": { kind: "work", note: "ได้จากการทำงานจริงเท่านั้น",
    route: "รับงาน freelance หรือทำโปรเจกต์ให้หน่วยงานจริงในมหาวิทยาลัย" },
  "อ่านและ implement งานวิจัย": { kind: "work", note: "ได้จากโครงงานหรือแล็บวิจัย",
    route: "ขอเข้าแล็บอาจารย์ หรือทำโปรเจกต์ปี 4 สายนี้" },
  "Cost estimation / TCO": { kind: "work", note: "ได้จากการทำงานจริงเท่านั้น",
    route: "ต้องเคยเสนอราคาให้ลูกค้าจริง" }
};

/* ใบหลักสูตรจริง — รหัสวิชา ord ใช้เทียบกับ "ตำแหน่งปัจจุบัน" ของผู้ใช้แต่ละคน
   11=ปี1เทอม1 12=ปี1เทอม2 21=ปี2เทอม1 22=ปี2เทอม2 31=ปี3เทอม1 32=ปี3เทอม2 41=ปี4เทอม1 42=ปี4เทอม2 */
export const COURSES_CS: Record<string, Course> = {
  "คพ.103": { name: "การโปรแกรมคอมพิวเตอร์เบื้องต้น · Introduction to Computer Programming", when: "ปี 1 · เทอม 1", ord: 11 },
  "คพ.100": { name: "การพัฒนาเว็บแอปพลิเคชันเบื้องต้น · Basic Web Development", when: "ปี 1 · เทอม 2", ord: 12 },
  "คพ.111": { name: "แนวคิดเชิงวัตถุ · Object-Oriented Concepts", when: "ปี 1 · เทอม 2", ord: 12 },
  "คพ.216": { name: "โครงสร้างข้อมูลและขั้นตอนวิธี · Data Structures and Algorithms", when: "ปี 2 · เทอม 1", ord: 21 },
  "คพ.240": { name: "หลักการวิทยาการข้อมูล · Principles of Data Science", when: "ปี 2 · เทอม 1", ord: 21 },
  "คพ.251": { name: "ระบบฐานข้อมูล 1 · Database Systems 1", when: "ปี 2 · เทอม 2", ord: 22 },
  "คพ.234": { name: "เครือข่ายคอมพิวเตอร์และความปลอดภัยทางไซเบอร์ · Computer Network and Cyber-Security", when: "ปี 2 · เทอม 2", ord: 22 },
  "คพ.232": { name: "เทคโนโลยีกลุ่มเมฆเบื้องต้น · Introduction to Cloud Computing", when: "ปี 2 · เทอม 2", ord: 22 },
  "คพ.261": { name: "วิศวกรรมซอฟต์แวร์เบื้องต้น · Introduction to Software Engineering", when: "ปี 3 · เทอม 1", ord: 31 },
  "คพ.365": { name: "กระบวนการและไปป์ไลน์เดฟออปส์ · DevOps Pipelines and Processes", when: "ปี 3 · เทอม 1", ord: 31 },
  "คพ.262": { name: "การทดสอบซอฟต์แวร์เบื้องต้น · Introduction to Software Testing", when: "ปี 3 · เทอม 2", ord: 32 },
  "คพ.224": { name: "การดูแลและติดตามประสิทธิภาพระบบปฏิบัติการ · Linux Administration and Performance Monitoring", when: "ปี 3 · เทอม 2", ord: 32 },
  "คพ.341": { name: "วิศวกรรมข้อมูลขนาดใหญ่ · Big Data Engineering", when: "ปี 3 · เทอม 2", ord: 32 },
  "คพ.347": { name: "คลังข้อมูลและอัจฉริยะทางธุรกิจ · Data Warehousing and Business Intelligence", when: "ปี 3 · เทอม 2", ord: 32 },
  "คพ.354": { name: "ระบบฐานข้อมูล 2 · Database Systems 2", when: "ปี 3 · เทอม 2", ord: 32 },
  "คพ.246": { name: "การแสดงข้อมูล · Data Visualization", when: "ปี 3 · เทอม 2", ord: 32 },
  "คพ.361": { name: "สถาปัตยกรรมซอฟต์แวร์บนคลาวด์ · Cloud-Based Software Architecting", when: "ปี 3 · เทอม 2", ord: 32 },
  "คพ.372": { name: "การเรียนรู้ของเครื่อง · Machine Learning", when: "ปี 3 · เทอม 2", ord: 32 },
  "คพ.343": { name: "การเรียนรู้เชิงลึก · Applied Deep Learning", when: "ปี 4 · เทอม 1", ord: 41 },
  "คพ.367": { name: "แนวคิดการพัฒนาเว็บบริการ · Web Service Development Concepts", when: "ปี 3 · เทอม 2", ord: 32 }
};

/* ============================================================
   หลักสูตร วท.บ. สาขาวิชาสถิติ (ปรับปรุง พ.ศ. 2566)
   คณะวิทยาศาสตร์และเทคโนโลยี มหาวิทยาลัยธรรมศาสตร์ ศูนย์รังสิต
   สกัดจาก "10.หลักสูตรวิทยาศาสตรบัณฑิต สาขาวิชาสถิติ 2566.pdf" (169 หน้า ฉบับเต็ม)

   หลักสูตรนี้แยกเป็น 2 วิชาเอกตามที่เอกสาร §4.3.2.2 ระบุไว้ — รายวิชาบังคับร่วมกันเกือบทั้งหมด
   แต่ "ลำดับเทอมที่เรียน" ต่างกันในบางวิชา จึงต้องแยกเป็น 2 major ในระบบ ไม่ใช่ major เดียว:
     - สถิติศาสตร์ (stat-sci-tu)     สำหรับนักศึกษาโครงการภาคปกติ
     - วิทยาการวิเคราะห์ข้อมูล (stat-da-tu) สำหรับนักศึกษาโครงการภาคพิเศษ

   ord ของแต่ละวิชา มี 2 ที่มา:
     - core (แน่นอน) — ยกมาจากตารางแผนการศึกษาจริงในเอกสาร (หน้า 28–33) ตรงตัว
     - est. (ประมาณ) — ไม่มีเทอมกำกับตายตัวในแผน (วิชาเลือก) จึงคำนวณจาก
       max(เทอมแรกที่วิชาบังคับก่อนเปิดทาง, เทอมตามธรรมเนียมเลขวิชา 2XX→ปี2 3XX→ปี3 4XX→ปี4)
       แล้วเลือกค่าที่ "หลังกว่า" ของสองค่านี้ — ระบุชัดเจนต่อผู้ใช้ว่าเป็นการประมาณ ไม่ใช่แผนทางการ

   หมายเหตุขอบเขตข้อมูล: รหัสวิชาบางตัวที่พบในเอกสาร (เช่น ส.226/ส.326/ส.327/ส.328/ส.329/ส.457/ส.467)
   ถูกตัดออกจากรายวิชาของสาขานี้อย่างตั้งใจ — ตรวจสอบแล้วว่าเป็นรหัสวิชาเทียบเท่าสำหรับ "นักศึกษาสาขาอื่น"
   (เช่น ส.457 = ระเบียบวิธีวิจัย "ทางสังคมศาสตร์" ส่วนสาขาสถิติเองใช้ ส.451) ไม่ใช่วิชาของสาขาสถิติเอง
   ============================================================ */

/* ---- ชื่อวิชา (ใช้ร่วมกันทั้ง 2 วิชาเอก — ต่างกันแค่ ord) ---- */
const STAT_COURSE_NAMES: Record<string, string> = {
  "190": "สัมมนาอาชีพ · Career Seminar",
  "211": "สถิติ 1 · Statistics 1",
  "212": "สถิติ 2 · Statistics 2",
  "221": "วิทยาการข้อมูลเบื้องต้นและการประยุกต์ · Intro to Data Science and Its Applications",
  "246": "ความรู้ทั่วไปเกี่ยวกับการประกันภัย · General Principles of Insurance",
  "247": "ตลาดการเงินและการลงทุนในหลักทรัพย์ · Financial Market and Portfolio Investment",
  "271": "ฐานข้อมูลและการเตรียมข้อมูลเบื้องต้น · Intro to Database and Data Preprocessing",
  "276": "วิทยาการวิเคราะห์ข้อมูลในตารางงาน · Spreadsheet Data Analytics",
  "321": "ทฤษฎีความน่าจะเป็นเบื้องต้น · Introductory Probability Theory",
  "322": "คณิตสถิติศาสตร์ 1 · Mathematical Statistics 1",
  "332": "การวิเคราะห์การถดถอยประยุกต์ · Applied Regression Analysis",
  "333": "ฝึกปฏิบัติงานทางสถิติ · Practical Experiences in Statistics",
  "336": "การควบคุมคุณภาพเชิงสถิติ · Statistical Quality Control",
  "337": "สถิติศาสตร์ไม่อิงพารามิเตอร์เบื้องต้น · Intro to Nonparametric Statistics",
  "339": "ประชากรศาสตร์ 1 · Demography 1",
  "346": "ทฤษฎีดอกเบี้ย · Theory of Interest",
  "347": "คณิตศาสตร์ประกันชีวิต 1 · Mathematics of Life Insurance 1",
  "348": "การวิเคราะห์เชิงปริมาณทางการเงิน · Quantitative Analysis in Finance",
  "349": "คณิตศาสตร์ประกันวินาศภัย · Casualty Actuarial Mathematics",
  "351": "การสำรวจตัวอย่างเบื้องต้น · Intro to Sample Surveys",
  "371": "วิทยาการวิเคราะห์เชิงทำนาย 1 · Predictive Analytics 1",
  "376": "การวิเคราะห์ข้อมูลและการคำนวณด้วยโปรแกรมสำเร็จรูปทางสถิติ · Data Analysis and Computing with Statistical Packages",
  "378": "การเล่าเรื่องจากข้อมูล · Data Storytelling",
  "386": "ชีวสถิติเบื้องต้น · Intro to Biostatistics",
  "422": "คณิตสถิติศาสตร์ 2 · Mathematical Statistics 2",
  "428": "หัวข้อพิเศษทางคณิตศาสตร์ประกันภัย · Special Topics in Actuarial Mathematics",
  "431": "การออกแบบการทดลอง · Experimental Design",
  "436": "การวิเคราะห์การตัดสินใจทางสถิติเบื้องต้น · Intro to Statistical Decision Analysis",
  "437": "ตรรกศาสตร์ฟัซซีสำหรับธุรกิจและการเงิน · Fuzzy Logic for Business and Finance",
  "438": "อนุกรมเวลาและการพยากรณ์ · Time Series and Forecasting",
  "439": "ประชากรศาสตร์ 2 · Demography 2",
  "446": "ตัวแบบค่าเสียหายขั้นพื้นฐาน · Basic Loss Models",
  "447": "คณิตศาสตร์ประกันชีวิต 2 · Mathematics of Life Insurance 2",
  "448": "อนุพันธ์ทางการเงินเชิงคณิตศาสตร์ · Mathematics of Financial Derivatives",
  "449": "สัมมนาคณิตศาสตร์ประกันภัย · Seminar in Actuarial Mathematics",
  "451": "ระเบียบวิธีการวิจัย · Research Methodology",
  "466": "การวิจัยดำเนินงาน · Operations Research",
  "468": "วิทยาการวิเคราะห์ลูกค้าและการบริหารความสัมพันธ์ · Customer Analytics and CRM",
  "476": "การจำลองเบื้องต้น · Intro to Simulation",
  "481": "วิทยาการวิเคราะห์เชิงทำนาย 2 · Predictive Analytics 2",
  "486": "การวิเคราะห์หลายตัวแปรประยุกต์ · Applied Multivariate Analysis",
  "487": "การเรียนรู้เชิงสถิติเบื้องต้น · Intro to Statistical Learning",
  "494": "โครงงานพิเศษ 1 · Special Project 1",
  "495": "โครงงานพิเศษ 2 · Special Project 2",
  "497": "หัวข้อพิเศษ · Special Topics",
  "498": "หัวข้อคัดสรร · Selected Topics"
};

/* ---- ord: สถิติศาสตร์ (โครงการภาคปกติ) — core = ยืนยันจากแผนการศึกษาจริง, ไม่มีเครื่องหมาย = ประมาณ ---- */
const STAT_A_ORD: Record<string, number> = {
  "190": 12, "211": 11, "212": 12, "221": 21, "246": 22, "247": 22, "271": 22, "276": 22,
  "321": 22, "322": 31, "332": 31, "333": 31, "336": 31, "337": 31, "339": 31, "346": 31,
  "347": 32, "348": 31, "349": 31, "351": 31, "371": 32, "376": 31, "378": 31, "386": 31,
  "422": 41, "428": 41, "431": 41, "436": 41, "437": 41, "438": 41, "439": 41, "446": 41,
  "447": 41, "448": 41, "449": 42, "451": 32, "466": 41, "468": 41, "476": 41, "481": 41,
  "486": 41, "487": 41, "494": 32, "495": 41, "497": 41, "498": 41
};
/* core: 190,211,212,221,321,322,332,351,376,422,431,451,494,495 — ที่เหลือประมาณจากห่วงโซ่วิชาบังคับก่อน + ธรรมเนียมเลขวิชา */

/* ---- ord: วิทยาการวิเคราะห์ข้อมูล (โครงการภาคพิเศษ) ---- */
const STAT_B_ORD: Record<string, number> = {
  "190": 12, "211": 11, "212": 12, "221": 21, "246": 22, "247": 22, "271": 22, "276": 22,
  "321": 21, "322": 31, "332": 22, "333": 31, "336": 31, "337": 31, "339": 31, "346": 31,
  "347": 32, "348": 31, "349": 31, "351": 31, "371": 32, "376": 31, "378": 31, "386": 31,
  "422": 41, "428": 41, "431": 41, "436": 41, "437": 41, "438": 41, "439": 41, "446": 41,
  "447": 41, "448": 41, "449": 42, "451": 32, "466": 41, "468": 41, "476": 41, "481": 41,
  "486": 41, "487": 41, "494": 32, "495": 41, "497": 41, "498": 41
};
/* core: 190,211,212,221,271,321,322,332,371,376,451,481,494,495 — ที่เหลือประมาณเช่นเดียวกับข้างบน */

function buildStatCourses(ordMap: Record<string, number>): Record<string, Course> {
  const out: Record<string, Course> = {};
  for (const [code, ord] of Object.entries(ordMap)) {
    const y = Math.floor(ord / 10);
    const t = ord % 10;
    out[`ส.${code}`] = { name: STAT_COURSE_NAMES[code], when: `ปี ${y} · เทอม ${t}`, ord };
  }
  return out;
}

export const COURSES_STAT_A: Record<string, Course> = buildStatCourses(STAT_A_ORD);
export const COURSES_STAT_B: Record<string, Course> = buildStatCourses(STAT_B_ORD);

/* ---- ทักษะที่จับคู่กับแต่ละวิชา — ใช้ร่วมกันทั้ง 2 วิชาเอก (การจับคู่ทักษะไม่ขึ้นกับ ord)
   ทักษะที่ใช้ชื่อคีย์เดียวกับ SK_CS (SQL, Python ฯลฯ) จงใจให้ตรงกัน เพื่อให้ระบบคำนวณ
   ความครอบคลุมต่ออาชีพ (DEMAND) ได้เหมือนกับสาขาวิทยาการคอมพิวเตอร์ — นักศึกษาสถิติที่มีวิชา
   สอนทักษะเดียวกันจะได้เห็นเปอร์เซ็นต์ความครอบคลุมของอาชีพ Data Analyst / ML Engineer ฯลฯ ด้วยหลักสูตรของตัวเอง ---- */
export const SK_STAT: Record<string, SkillMeta> = {
  "SQL": { code: "ส.271", note: "ส.271 ฐานข้อมูลและการเตรียมข้อมูลเบื้องต้น",
    alias: "เอกสารเขียนว่า “ภาษาคิวรีที่มีโครงสร้าง” — ไม่มีคำว่า SQL เลย ฉบับอังกฤษเขียน “structured query language” เต็มคำ",
    src: "ส.271 · ส.221 ก็กล่าวถึงเช่นกัน (“การจัดการข้อมูลด้วยเอสคิวแอลเบื้องต้น” — ทับศัพท์ไทย ไม่ใช่ตัวอักษรละติน SQL)" },
  "Python": { code: "ส.221", note: "ส.221 วิทยาการข้อมูลเบื้องต้นและการประยุกต์ — กล่าวถึงไพทอนตรงตัว" },
  "Power BI / Tableau": { code: "ส.221", note: "ส.221 วิทยาการข้อมูลเบื้องต้นและการประยุกต์ — กล่าวถึง Tableau และ Power BI ตรงตัว" },
  "Excel ขั้นสูง": { code: "ส.276", note: "ส.276 วิทยาการวิเคราะห์ข้อมูลในตารางงาน" },
  "VBA (Visual Basic for Applications)": { code: "ส.276", note: "ส.276 วิทยาการวิเคราะห์ข้อมูลในตารางงาน — กล่าวถึง VBA ตรงตัว" },
  "สถิติเชิงพรรณนา": { code: "ส.211", note: "ส.211 สถิติ 1" },
  "คณิตศาสตร์ / สถิติ": { code: "ส.321", note: "ส.321 ทฤษฎีความน่าจะเป็นเบื้องต้น" },
  "Data cleaning / wrangling": { code: "ส.271", note: "ส.271 ฐานข้อมูลและการเตรียมข้อมูลเบื้องต้น" },
  "Machine learning พื้นฐาน": { code: "ส.371", note: "ส.371 วิทยาการวิเคราะห์เชิงทำนาย 1 — ระบุชื่ออัลกอริทึมตรงตัว: logistic regression, k-NN, decision tree, random forest, Naive Bayes, ANN, SVM (ส.487 ครอบคลุมเพิ่มเติม)" },
  "Deep learning": { code: "ส.481", note: "ส.481 วิทยาการวิเคราะห์เชิงทำนาย 2 — โครงข่ายประสาทเทียมคอนโวลูชัน/แบบวนกลับ (CNN/RNN) ตรงตัว" },
  "การนำเสนอข้อมูลด้วยภาพ": { code: "ส.378", note: "ส.378 การเล่าเรื่องจากข้อมูล" },
  "A/B testing / การออกแบบการทดลอง": { code: "ส.431", note: "ส.431 การออกแบบการทดลอง" },
  "Regression analysis": { code: "ส.332", note: "ส.332 การวิเคราะห์การถดถอยประยุกต์" },

  "Relational database model": { code: "ส.271", note: "ส.271 ฐานข้อมูลและการเตรียมข้อมูลเบื้องต้น" },
  "Classification / Regression": { code: "ส.221", note: "ส.221 วิทยาการข้อมูลเบื้องต้นและการประยุกต์" },
  "Decision tree / Random forest / Naive Bayes": { code: "ส.371", note: "ส.371 วิทยาการวิเคราะห์เชิงทำนาย 1" },
  "K-means clustering / PCA": { code: "ส.481", note: "ส.481 วิทยาการวิเคราะห์เชิงทำนาย 2" },
  "Regularization (Ridge / Lasso)": { code: "ส.487", note: "ส.487 การเรียนรู้เชิงสถิติเบื้องต้น" },
  "PCA / Factor / Discriminant analysis": { code: "ส.486", note: "ส.486 การวิเคราะห์หลายตัวแปรประยุกต์" },
  "Time series forecasting (ARIMA)": { code: "ส.438", note: "ส.438 อนุกรมเวลาและการพยากรณ์" },
  "Customer analytics / CRM / Churn prediction": { code: "ส.468", note: "ส.468 วิทยาการวิเคราะห์ลูกค้าและการบริหารความสัมพันธ์" },
  "โปรแกรมสำเร็จรูปทางสถิติ": { code: "ส.376", note: "ส.376 การวิเคราะห์ข้อมูลและการคำนวณด้วยโปรแกรมสำเร็จรูปทางสถิติ",
    alias: "เอกสารไม่ระบุชื่อโปรแกรม (SPSS/SAS/R/Minitab) เขียนแค่ “โปรแกรมสำเร็จรูปทางสถิติ” ตลอดทั้งหลักสูตร — จุดที่แม้แต่มนุษย์อ่านก็ยังไม่รู้ว่าเป็นเครื่องมือตัวไหนจริง" },
  "Monte Carlo / MCMC simulation": { code: "ส.476", note: "ส.476 การจำลองเบื้องต้น — ส.376 ก็กล่าวถึงเช่นกัน" },
  "Survey sampling methodology": { code: "ส.351", note: "ส.351 การสำรวจตัวอย่างเบื้องต้น" },
  "Statistical process control": { code: "ส.336", note: "ส.336 การควบคุมคุณภาพเชิงสถิติ" },
  "Linear programming / Optimization": { code: "ส.466", note: "ส.466 การวิจัยดำเนินงาน" },
  "Biostatistics / Survival analysis": { code: "ส.386", note: "ส.386 ชีวสถิติเบื้องต้น" },
  "Demographic analysis": { code: "ส.339", note: "ส.339 ประชากรศาสตร์ 1 (ส.439 ประชากรศาสตร์ 2 ครอบคลุมเพิ่มเติม)" },
  "ANOVA / Chi-square test": { code: "ส.212", note: "ส.212 สถิติ 2" },
  "Nonparametric statistics": { code: "ส.337", note: "ส.337 สถิติศาสตร์ไม่อิงพารามิเตอร์เบื้องต้น" },
  "MLE / Bayesian inference": { code: "ส.322", note: "ส.322 คณิตสถิติศาสตร์ 1 (ส.422 คณิตสถิติศาสตร์ 2 ครอบคลุมเพิ่มเติม)" },
  "Decision theory": { code: "ส.436", note: "ส.436 การวิเคราะห์การตัดสินใจทางสถิติเบื้องต้น" },
  "Fuzzy logic": { code: "ส.437", note: "ส.437 ตรรกศาสตร์ฟัซซีสำหรับธุรกิจและการเงิน" },

  /* ---- คลัสเตอร์คณิตศาสตร์ประกันภัย — 9 วิชา ไม่มีอาชีพในระบบรองรับตอนนี้ (ดู about page) ---- */
  "Insurance fundamentals / Risk management": { code: "ส.246", note: "ส.246 ความรู้ทั่วไปเกี่ยวกับการประกันภัย" },
  "Interest / annuity theory": { code: "ส.346", note: "ส.346 ทฤษฎีดอกเบี้ย" },
  "Life insurance mathematics": { code: "ส.347", note: "ส.347 คณิตศาสตร์ประกันชีวิต 1 (ส.447 ภาค 2 ครอบคลุมเพิ่มเติม)" },
  "Quantitative finance / Capital budgeting": { code: "ส.348", note: "ส.348 การวิเคราะห์เชิงปริมาณทางการเงิน" },
  "Ratemaking / Loss reserving": { code: "ส.349", note: "ส.349 คณิตศาสตร์ประกันวินาศภัย" },
  "Loss modeling / Value-at-Risk (VaR)": { code: "ส.446", note: "ส.446 ตัวแบบค่าเสียหายขั้นพื้นฐาน" },
  "Financial derivatives / Options pricing": { code: "ส.448", note: "ส.448 อนุพันธ์ทางการเงินเชิงคณิตศาสตร์" },
  "Portfolio management / Security analysis": { code: "ส.247", note: "ส.247 ตลาดการเงินและการลงทุนในหลักทรัพย์" },
  "Actuarial special topics / seminar": { code: "ส.428", note: "ส.428 หัวข้อพิเศษทางคณิตศาสตร์ประกันภัย (ส.449 สัมมนาฯ ต่อเนื่องกัน)" },

  /* ---- วิธีการ/ประสบการณ์ตรง — ไม่ใช่ทักษะเครื่องมือ ---- */
  "ระเบียบวิธีการวิจัย": { code: "ส.451", note: "ส.451 ระเบียบวิธีการวิจัย" },
  "โครงงานประยุกต์": { code: "ส.494", note: "ส.494 โครงงานพิเศษ 1 (ส.495 ภาค 2 ต่อเนื่องกัน)" },
  "ฝึกงานภาคสถิติ (200 ชม.)": { code: "ส.333", note: "ส.333 ฝึกปฏิบัติงานทางสถิติ — หลักสูตรบังคับฝึกงานจริงอย่างน้อย 200 ชั่วโมง" }
};

export const TERMS: Term[] = [
  { ord: 11, y: "ปี 1", t: "เทอม 1" }, { ord: 12, y: "ปี 1", t: "เทอม 2" },
  { ord: 21, y: "ปี 2", t: "เทอม 1" }, { ord: 22, y: "ปี 2", t: "เทอม 2" },
  { ord: 31, y: "ปี 3", t: "เทอม 1" }, { ord: 32, y: "ปี 3", t: "เทอม 2" },
  { ord: 41, y: "ปี 4", t: "เทอม 1" }, { ord: 42, y: "ปี 4", t: "เทอม 2" }
];

/* ============================================================
   roles + per-role demand (junior / senior)
   ============================================================ */
export const ROLES: Role[] = [
  { id: "de", name: "Data Engineer", posts: 480, jrPosts: 214, fit: 1 },
  { id: "be", name: "Software Engineer (Backend)", posts: 1240, jrPosts: 612, fit: 2 },
  { id: "da", name: "Data Analyst", posts: 610, jrPosts: 341, fit: 3 },
  { id: "ml", name: "ML Engineer", posts: 210, jrPosts: 74, fit: 4 },
  { id: "do", name: "DevOps / SRE", posts: 390, jrPosts: 118, fit: 5 },
  { id: "sa", name: "Solutions Architect", posts: 145, jrPosts: 12, fit: 6 }
];

export const DEMAND: Record<string, DemandLevels> = {
  de: {
    jr: [["SQL", 188], ["Python", 174], ["Cloud (AWS / GCP)", 106],
      ["Docker", 86], ["ETL / data pipeline", 85], ["Git / version control", 73],
      ["Data warehouse concepts", 59], ["Apache Spark", 54], ["สื่อสารกับ stakeholder", 53],
      ["Linux / shell", 46]],
    sr: [["System / pipeline architecture", 218], ["Apache Kafka", 147], ["Cloud cost optimisation", 125],
      ["Cloud (AWS / GCP)", 121], ["นำทีม / mentoring", 107], ["Data governance", 79],
      ["SQL", 72], ["Terraform / IaC", 60]]
  },
  be: {
    jr: [["Git / version control", 551], ["REST API", 529], ["SQL", 478],
      ["Python", 347], ["Java / Spring Boot", 317], ["Docker", 292],
      ["OOP / design patterns", 269], ["Unit testing", 232], ["Linux / shell", 216],
      ["CI/CD", 196], ["Cloud (AWS / GCP)", 166], ["สื่อสารกับ stakeholder", 133]],
    sr: [["System / pipeline architecture", 502], ["Microservices", 383], ["Kubernetes", 351],
      ["นำทีม / mentoring", 332], ["Cloud (AWS / GCP)", 312], ["Performance tuning / scaling", 265],
      ["Message queue (Kafka / RabbitMQ)", 216], ["Security / OWASP", 167]]
  },
  da: {
    jr: [["SQL", 300], ["Excel ขั้นสูง", 251], ["Power BI / Tableau", 221],
      ["Python", 172], ["สื่อสารกับ stakeholder", 161], ["สถิติเชิงพรรณนา", 137],
      ["การนำเสนอข้อมูลด้วยภาพ", 119], ["แปลโจทย์ธุรกิจเป็นคำถามเชิงข้อมูล", 105], ["Data cleaning / wrangling", 95],
      ["Google Analytics", 62]],
    sr: [["แปลโจทย์ธุรกิจเป็นคำถามเชิงข้อมูล", 229], ["A/B testing / การออกแบบการทดลอง", 185], ["Data modeling", 165],
      ["นำทีม / mentoring", 148], ["dbt / analytics engineering", 107], ["SQL", 97],
      ["Data governance", 80]]
  },
  ml: {
    jr: [["Python", 67], ["Machine learning พื้นฐาน", 59], ["SQL", 47],
      ["PyTorch / TensorFlow", 43], ["Docker", 38], ["คณิตศาสตร์ / สถิติ", 35],
      ["Cloud (AWS / GCP)", 31], ["Deep learning", 28], ["Git / version control", 26],
      ["อ่านและ implement งานวิจัย", 21]],
    sr: [["MLOps / model deployment", 109], ["System / pipeline architecture", 97], ["Feature store / data pipeline", 77],
      ["Model monitoring / drift", 72], ["นำทีม / mentoring", 59], ["Distributed training", 48],
      ["Cloud cost optimisation", 38]]
  },
  do: {
    jr: [["Linux / shell", 109], ["Docker", 98], ["CI/CD", 91],
      ["Kubernetes", 75], ["Cloud (AWS / GCP)", 71], ["Git / version control", 64],
      ["Networking พื้นฐาน", 54], ["Terraform / IaC", 47], ["Monitoring / observability", 43],
      ["on-call / incident response", 40], ["Python / scripting", 37]],
    sr: [["System / pipeline architecture", 212], ["on-call / incident response", 181], ["Kubernetes", 165],
      ["Cloud cost optimisation", 140], ["Security / compliance", 119], ["นำทีม / mentoring", 96],
      ["Terraform / IaC", 85]]
  },
  sa: {
    jr: [], // below the 30-posting floor — see about page §เกณฑ์ปฏิเสธ
    sr: [["System / solution architecture", 113], ["Cloud (AWS / GCP)", 102], ["คุยกับลูกค้า / requirement gathering", 90],
      ["Microservices / integration", 75], ["Security / compliance", 66], ["นำทีม / mentoring", 59],
      ["Cost estimation / TCO", 35]]
  }
};

export const STATE: Record<string, { g: string; t: string }> = {
  covered: { g: "g-covered", t: "เรียนแล้ว" },
  hidden: { g: "g-hidden", t: "เรียนแล้ว — แต่เอกสารใช้คำอื่น" },
  progress: { g: "g-progress", t: "กำลังเรียน" },
  available: { g: "g-available", t: "มีวิชาให้ลง" },
  none: { g: "g-none", t: "ไม่มีวิชาสอน" }
};

export const MIN_POSTS = 30;

/* sample postings for the evidence drawer */
export const POSTS: Record<string, Post[]> = {
  sql: [
    { co: "บริษัทค้าปลีกออนไลน์ (สมุทรปราการ)", meta: "โพสต์ 12 วันที่แล้ว · เงินเดือน 35–50K", q: 'ดูแลระบบข้อมูลของทีม analytics ผู้สมัครควร<mark>ใช้ SQL ได้คล่อง</mark> และเคยทำงานกับข้อมูลขนาดใหญ่' },
    { co: "ธนาคารพาณิชย์ (กรุงเทพฯ)", meta: "โพสต์ 4 วันที่แล้ว · เงินเดือนไม่ระบุ", q: 'รับผิดชอบการจัดเตรียมข้อมูลสำหรับรายงานผู้บริหาร <mark>มีประสบการณ์เขียน query</mark> อย่างน้อย 1 ปี' },
    { co: "Logistics tech startup (นนทบุรี)", meta: "โพสต์ 21 วันที่แล้ว · เงินเดือน 30–45K", q: 'ยินดีรับนักศึกษาจบใหม่ ขอให้<mark>พื้นฐานฐานข้อมูลแน่น</mark> และพร้อมเรียนรู้เครื่องมือใหม่' }
  ],
  java: [
    { co: "บริษัทประกันชีวิต (กรุงเทพฯ)", meta: "โพสต์ 7 วันที่แล้ว · เงินเดือน 40–65K", q: 'ดูแลระบบหลังบ้านของงานกรมธรรม์ <mark>ผู้สมัครควรเคยใช้ Spring Boot</mark> ในโปรเจกต์จริง' },
    { co: "ผู้ให้บริการระบบธนาคาร (กรุงเทพฯ)", meta: "โพสต์ 11 วันที่แล้ว · เงินเดือน 45–70K", q: 'พัฒนา service ฝั่ง backend <mark>เขียน Java ได้คล่อง</mark> และเข้าใจหลัก OOP เป็นอย่างดี' },
    { co: "บริษัทซอฟต์แวร์โลจิสติกส์ (สมุทรปราการ)", meta: "โพสต์ 3 วันที่แล้ว · เงินเดือน 32–48K", q: 'ยินดีรับนักศึกษาจบใหม่ <mark>มีพื้นฐาน Java หรือเคยลอง Spring framework</mark> จะพิจารณาเป็นพิเศษ' }
  ],
  git: [
    { co: "บริษัทพัฒนาซอฟต์แวร์ (กรุงเทพฯ)", meta: "โพสต์ 5 วันที่แล้ว · เงินเดือน 35–55K", q: 'ทำงานเป็นทีม 6 คน <mark>ใช้ Git ร่วมกับทีมได้</mark> เข้าใจการแตก branch และ review code' },
    { co: "Health tech startup (กรุงเทพฯ)", meta: "โพสต์ 13 วันที่แล้ว · เงินเดือน 30–50K", q: '<mark>คุ้นเคยกับ version control</mark> และการทำงานแบบ agile' },
    { co: "บริษัทที่ปรึกษาไอที (ชลบุรี)", meta: "โพสต์ 9 วันที่แล้ว · เงินเดือนไม่ระบุ", q: 'รับผิดชอบงานพัฒนาร่วมกับทีมต่างประเทศ <mark>เคยทำงานบน Git flow</mark> มาก่อน' }
  ],
  restapi: [
    { co: "E-commerce platform (กรุงเทพฯ)", meta: "โพสต์ 2 วันที่แล้ว · เงินเดือน 38–58K", q: '<mark>ออกแบบและพัฒนา REST API</mark> สำหรับแอปมือถือและเว็บ' },
    { co: "บริษัทประกันภัย (นนทบุรี)", meta: "โพสต์ 16 วันที่แล้ว · เงินเดือน 35–52K", q: '<mark>เขียน API เชื่อมต่อระบบภายใน</mark> และดูแลเอกสาร API ให้เป็นปัจจุบัน' },
    { co: "Food delivery (กรุงเทพฯ)", meta: "โพสต์ 6 วันที่แล้ว · เงินเดือน 40–60K", q: 'พัฒนา web service รองรับผู้ใช้จำนวนมาก <mark>เข้าใจหลักการออกแบบ API</mark>' }
  ],
  python: [
    { co: "บริษัทวิเคราะห์ข้อมูล (กรุงเทพฯ)", meta: "โพสต์ 4 วันที่แล้ว · เงินเดือน 35–55K", q: '<mark>เขียน Python ได้</mark> สำหรับงานประมวลผลข้อมูลและงานอัตโนมัติ' },
    { co: "โรงงานผลิตชิ้นส่วน (ระยอง)", meta: "โพสต์ 18 วันที่แล้ว · เงินเดือน 30–45K", q: 'ทำระบบเก็บข้อมูลสายการผลิต <mark>ใช้ Python เขียนสคริปต์</mark> ได้' },
    { co: "Insurtech (กรุงเทพฯ)", meta: "โพสต์ 8 วันที่แล้ว · เงินเดือน 42–62K", q: '<mark>มีประสบการณ์ Python</mark> อย่างน้อย 1 ปี หรือมีโปรเจกต์ที่แสดงได้' }
  ],
  cicd: [
    { co: "บริษัทซอฟต์แวร์องค์กร (กรุงเทพฯ)", meta: "โพสต์ 10 วันที่แล้ว · เงินเดือน 45–68K", q: '<mark>เคยตั้ง CI/CD pipeline</mark> ให้รัน test และ deploy อัตโนมัติ' },
    { co: "Mobile app studio (เชียงใหม่)", meta: "โพสต์ 14 วันที่แล้ว · เงินเดือน 35–55K", q: '<mark>คุ้นเคยกับ GitHub Actions หรือ GitLab CI</mark> จะได้เปรียบ' },
    { co: "บริษัทค้าปลีก (กรุงเทพฯ)", meta: "โพสต์ 1 วันที่แล้ว · เงินเดือน 40–60K", q: 'ปรับปรุงกระบวนการปล่อยระบบ <mark>เข้าใจแนวคิด continuous integration</mark>' }
  ],
  docker: [
    { co: "Fintech (กรุงเทพฯ)", meta: "โพสต์ 6 วันที่แล้ว · เงินเดือน 45–70K", q: 'ทีมทำงานบน microservices ผู้สมัครควร<mark>มีประสบการณ์ใช้ Docker</mark> และเข้าใจ CI/CD เบื้องต้น' },
    { co: "บริษัทซอฟต์แวร์เพื่อการแพทย์", meta: "โพสต์ 15 วันที่แล้ว · เงินเดือน 40–60K", q: 'พัฒนาและดูแล data service <mark>คุ้นเคยกับ container</mark> จะพิจารณาเป็นพิเศษ' },
    { co: "E-commerce platform (ชลบุรี)", meta: "โพสต์ 2 วันที่แล้ว · เงินเดือน 38–55K", q: 'ต้องการผู้ที่<mark>เคยใช้งาน Docker / Kubernetes มาก่อน</mark> ไม่จำเป็นต้องมีใบรับรอง' }
  ],
  linux: [
    { co: "ผู้ให้บริการคลาวด์ในประเทศ (กรุงเทพฯ)", meta: "โพสต์ 8 วันที่แล้ว · เงินเดือน 40–65K", q: 'ดูแลเซิร์ฟเวอร์ของลูกค้า ต้อง<mark>ใช้งาน Linux command line ได้</mark> และเขียน shell script พื้นฐานเป็น' },
    { co: "บริษัทเกม (กรุงเทพฯ)", meta: "โพสต์ 19 วันที่แล้ว · เงินเดือน 35–55K", q: 'ทำงานร่วมกับทีม backend <mark>คุ้นเคยกับสภาพแวดล้อม Unix/Linux</mark> จะได้เปรียบ' },
    { co: "บริษัทที่ปรึกษาไอที (นนทบุรี)", meta: "โพสต์ 3 วันที่แล้ว · เงินเดือน 30–48K", q: 'ติดตั้งและดูแลระบบ <mark>ประสบการณ์ Linux อย่างน้อย 1 ปี</mark> หรือมีโปรเจกต์ที่แสดงได้' }
  ],
  stakeholder: [
    { co: "บริษัทประกันภัย (กรุงเทพฯ)", meta: "โพสต์ 9 วันที่แล้ว · เงินเดือน 38–58K", q: 'ทำงานใกล้ชิดกับทีมธุรกิจ ต้อง<mark>สื่อสารผลการวิเคราะห์ให้ผู้ที่ไม่ใช่สายเทคนิคเข้าใจได้</mark>' },
    { co: "กลุ่มธุรกิจค้าปลีก (กรุงเทพฯ)", meta: "โพสต์ 14 วันที่แล้ว · เงินเดือนไม่ระบุ", q: '<mark>ประสานงานกับ stakeholder หลายฝ่าย</mark> เพื่อกำหนดขอบเขตของรายงาน' },
    { co: "โรงพยาบาลเอกชน (ปทุมธานี)", meta: "โพสต์ 5 วันที่แล้ว · เงินเดือน 32–46K", q: 'นำเสนอข้อมูลต่อผู้บริหาร <mark>มีทักษะการนำเสนอและอธิบายเชิงธุรกิจ</mark>' }
  ]
};

export function postKeyFor(skill: string): string | null {
  const s = skill.toLowerCase();
  if (s.includes("docker")) return "docker";
  if (s.includes("linux") || s.includes("shell")) return "linux";
  if (skill.includes("stakeholder")) return "stakeholder";
  if (s.includes("sql") || s.includes("database")) return "sql";
  if (s.includes("java") || s.includes("spring")) return "java";
  if (s.includes("git") || s.includes("version control")) return "git";
  if (s.includes("rest") || s.includes("api")) return "restapi";
  if (s.includes("python")) return "python";
  if (s.includes("ci/cd")) return "cicd";
  return null;
}

/* ============================================================
   MAJORS — วิทยาการคอมพิวเตอร์ และสถิติ (2 วิชาเอก) มีข้อมูลจริงรองรับ
   สาขาอื่นแสดงเป็น "เร็วๆ นี้" เพื่อให้เห็นทิศทางของแพลตฟอร์ม
   โดยไม่ใส่ข้อมูลที่ยังไม่ได้ตรวจสอบ
   ============================================================ */
export const MAJORS: Major[] = [
  { id: "cs-tu", name: "วิทยาการคอมพิวเตอร์", school: "คณะวิทยาศาสตร์และเทคโนโลยี มธ.", ready: true,
    note: "หลักสูตรปรับปรุง พ.ศ. 2566 · ข้อมูลรายวิชาอ้างอิงเอกสารจริง" },
  { id: "stat-sci-tu", name: "สถิติ — วิชาเอกสถิติศาสตร์", school: "คณะวิทยาศาสตร์และเทคโนโลยี มธ. ศูนย์รังสิต", ready: true,
    note: "หลักสูตรปรับปรุง พ.ศ. 2566 · โครงการภาคปกติ · บางวิชาเลือกไม่มีเทอมกำกับตายตัวในแผน จึงประมาณจากวิชาบังคับก่อน — ระบุไว้ในหน้ารายวิชา" },
  { id: "stat-da-tu", name: "สถิติ — วิชาเอกวิทยาการวิเคราะห์ข้อมูล", school: "คณะวิทยาศาสตร์และเทคโนโลยี มธ. ศูนย์รังสิต", ready: true,
    note: "หลักสูตรปรับปรุง พ.ศ. 2566 · โครงการภาคพิเศษ · บางวิชาเลือกไม่มีเทอมกำกับตายตัวในแผน จึงประมาณจากวิชาบังคับก่อน — ระบุไว้ในหน้ารายวิชา" },
  { id: "it-tu", name: "เทคโนโลยีสารสนเทศ", school: "คณะวิทยาศาสตร์และเทคโนโลยี มธ.", ready: false },
  { id: "ce", name: "วิศวกรรมคอมพิวเตอร์", school: "คณะวิศวกรรมศาสตร์", ready: false }
];

/* ---- ทุกหน้าที่ต้องดูข้อมูลรายวิชา/ทักษะของผู้ใช้ ต้องผ่าน 2 container นี้เท่านั้น
   ห้ามอ้าง SK_CS/COURSES_CS ฯลฯ ตรงๆ นอกไฟล์นี้ — ให้ major เป็นตัวกำหนดว่าใช้ชุดข้อมูลไหน ---- */
export const SK_BY_MAJOR: Record<string, Record<string, SkillMeta>> = {
  "cs-tu": SK_CS,
  "stat-sci-tu": SK_STAT,
  "stat-da-tu": SK_STAT
};

export const COURSES_BY_MAJOR: Record<string, Record<string, Course>> = {
  "cs-tu": COURSES_CS,
  "stat-sci-tu": COURSES_STAT_A,
  "stat-da-tu": COURSES_STAT_B
};

/* ============================================================
   RESEARCH — งานวิจัยผู้ใช้จริงจาก pitch deck (สัมภาษณ์ 29 ส.ค. 2569)
   ============================================================ */
export const RESEARCH: Research = {
  interviewed: 13,
  unsureCount: 9,
  unsurePct: 70,
  validated: 3,
  date: "29 ส.ค. 2569",
  majorBreakdown: [
    ["วิทยาการคอมพิวเตอร์", 76.9],
    ["สังคมวิทยาและมานุษยวิทยา", 7.7],
    ["วิศวกรรมโยธา", 7.7],
    ["บริหารธุรกิจ", 7.7]
  ],
  persona: {
    name: "เนเน่", year: "ปี 2", major: "วิทยาการคอมพิวเตอร์", goalRoleId: "da", goalLabel: "Data Analyst",
    beat1: "เปิดเว็บดูประกาศงาน อยากรู้ว่าตำแหน่งนี้ต้องการอะไรบ้าง — เธอมีเป้าหมาย แต่ไม่มีเส้นทาง",
    beat2: 'เจอคำว่า "Excel / Tableau / PowerBI" — คำที่ไม่เคยเห็นในหลักสูตรเลย',
    beat3: "Google กระจัดกระจาย ถาม AI ก็เดาจากเนื้อหา ประกาศเดียวมีคนสมัครแล้ว 100+ คน — ไม่มีทางเลือกไหนผิด ทุกทางคือการเดาที่ดีที่สุดของเธอ"
  }
};

/* reverse index: course code -> skills it teaches (for curriculum page) */
export function skillsForCourse(major: string, code: string): string[] {
  const sk = SK_BY_MAJOR[major] || {};
  return Object.keys(sk).filter((k) => sk[k].code === code);
}

/* how many tracked postings (across every role we cover) mention this skill */
export function demandFor(skillKey: string): { n: number; roles: number } {
  let n = 0;
  const roles = new Set<string>();
  Object.keys(DEMAND).forEach((rid) => {
    (["jr", "sr"] as const).forEach((lvl) => {
      (DEMAND[rid][lvl] || []).forEach(([k, c]) => {
        if (k === skillKey) { n += c; roles.add(rid); }
      });
    });
  });
  return { n, roles: roles.size };
}

export function tally(n: number, max: number): number[] {
  const ticks = Math.max(2, Math.min(26, Math.round(n / Math.max(1, max / 26))));
  return Array.from({ length: ticks }, (_, i) => 7 + Math.round((i / ticks) * 11));
}
