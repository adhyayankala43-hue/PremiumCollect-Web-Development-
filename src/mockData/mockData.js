/**
 * PremiumCollect - Mock Data Provider
 * Contains initial seed datasets, JSON loaders, and generator for 2,000+ policy records.
 */

export const DEFAULT_HOLDERS = [
  {
    id: 1,
    name: "Amit Sharma",
    policy_number: "LIC-12345",
    plan_name: "Jeevan Labh (Plan 936)",
    sum_assured: 500000,
    premium_amount: 12000,
    payment_frequency: "Yearly",
    next_due_date: "2026-12-01",
    phone: "+91 98765 43210",
    email: "amit.sharma@example.com",
    nominee: "Sunita Sharma (Wife)",
    agent_name: "R. K. Verma (AG-102)"
  },
  {
    id: 2,
    name: "Priya Patel",
    policy_number: "LIC-67890",
    plan_name: "Jeevan Umang (Plan 945)",
    sum_assured: 800000,
    premium_amount: 15000,
    payment_frequency: "Half-Yearly",
    next_due_date: "2026-10-25",
    phone: "+91 98234 56789",
    email: "priya.patel@example.com",
    nominee: "Rajesh Patel (Father)",
    agent_name: "Meera Sen (AG-109)"
  },
  {
    id: 3,
    name: "Rahul Verma",
    policy_number: "LIC-34102",
    plan_name: "Tech Term (Plan 854)",
    sum_assured: 1000000,
    premium_amount: 8500,
    payment_frequency: "Quarterly",
    next_due_date: "2026-09-10",
    phone: "+91 97112 34567",
    email: "rahul.verma@example.com",
    nominee: "Ananya Verma (Spouse)",
    agent_name: "R. K. Verma (AG-102)"
  },
  {
    id: 4,
    name: "Sunita Rao",
    policy_number: "LIC-88219",
    plan_name: "Bima Jyoti (Plan 860)",
    sum_assured: 600000,
    premium_amount: 5400,
    payment_frequency: "Monthly",
    next_due_date: "2026-10-18",
    phone: "+91 94450 12890",
    email: "sunita.rao@example.com",
    nominee: "Kavita Rao (Daughter)",
    agent_name: "S. K. Joshi (AG-115)"
  },
  {
    id: 5,
    name: "Vikramaditya Singh",
    policy_number: "LIC-55019",
    plan_name: "New Endowment Plan (914)",
    sum_assured: 1200000,
    premium_amount: 28000,
    payment_frequency: "Yearly",
    next_due_date: "2026-11-15",
    phone: "+91 99881 22334",
    email: "vikram.singh@example.com",
    nominee: "Gayatri Singh (Wife)",
    agent_name: "Meera Sen (AG-109)"
  },
  {
    id: 6,
    name: "Ananya Iyer",
    policy_number: "LIC-77401",
    plan_name: "Jeevan Anand (Plan 915)",
    sum_assured: 750000,
    premium_amount: 18500,
    payment_frequency: "Single Premium",
    next_due_date: "2026-10-30",
    phone: "+91 94421 99881",
    email: "ananya.iyer@example.com",
    nominee: "Subramanian Iyer (Father)",
    agent_name: "S. K. Joshi (AG-115)"
  }
];

export const DEFAULT_PAYMENTS = [
  {
    id: 1,
    holder_id: 1,
    amount: 12000,
    late_fee: 0,
    total_amount: 12000,
    due_date: "2025-12-01",
    paid_date: "2025-11-28",
    status: "Paid",
    payment_method: "UPI",
    reference_no: "UPI-48192801934",
    receipt_no: "RCP-2026-001",
    collector: "Pooja Hegde (Desk #01)",
    notes: "Annual premium renewal via Google Pay UPI"
  },
  {
    id: 2,
    holder_id: 2,
    amount: 15000,
    late_fee: 0,
    total_amount: 15000,
    due_date: "2026-04-15",
    paid_date: "2026-04-10",
    status: "Paid",
    payment_method: "Credit Card",
    reference_no: "POS-CC-90182",
    receipt_no: "RCP-2026-002",
    collector: "Pooja Hegde (Desk #01)",
    notes: "HDFC Visa Credit Card tap & pay"
  },
  {
    id: 3,
    holder_id: 4,
    amount: 5400,
    late_fee: 0,
    total_amount: 5400,
    due_date: "2026-09-18",
    paid_date: "2026-09-17",
    status: "Paid",
    payment_method: "Bank Transfer",
    reference_no: "NEFT-SBI-491029",
    receipt_no: "RCP-2026-003",
    collector: "Pooja Hegde (Desk #01)",
    notes: "Monthly ECS standing instruction cleared"
  },
  {
    id: 4,
    holder_id: 5,
    amount: 28000,
    late_fee: 0,
    total_amount: 28000,
    due_date: "2026-10-13",
    paid_date: "2026-10-13",
    status: "Paid",
    payment_method: "Cheque",
    reference_no: "CHQ-889124 (ICICI Bank)",
    receipt_no: "RCP-2026-004",
    collector: "Pooja Hegde (Desk #01)",
    notes: "Annual premium cheque deposited and cleared"
  }
];

export const DEFAULT_INSTALLMENTS = [
  { id: 1, holder_id: 1, installment_no: 1, total_installments: 16, amount: 12000, due_date: "2025-12-01", status: "Paid" },
  { id: 2, holder_id: 1, installment_no: 2, total_installments: 16, amount: 12000, due_date: "2026-12-01", status: "Pending" },
  { id: 3, holder_id: 2, installment_no: 1, total_installments: 20, amount: 15000, due_date: "2026-04-15", status: "Paid" },
  { id: 4, holder_id: 2, installment_no: 2, total_installments: 20, amount: 15000, due_date: "2026-10-25", status: "Pending" },
  { id: 5, holder_id: 3, installment_no: 3, total_installments: 40, amount: 8500, due_date: "2026-09-10", status: "Overdue" },
  { id: 6, holder_id: 4, installment_no: 8, total_installments: 120, amount: 5400, due_date: "2026-09-18", status: "Paid" },
  { id: 7, holder_id: 4, installment_no: 9, total_installments: 120, amount: 5400, due_date: "2026-10-18", status: "Pending" },
  { id: 8, holder_id: 5, installment_no: 2, total_installments: 25, amount: 28000, due_date: "2026-10-13", status: "Paid" },
  { id: 9, holder_id: 6, installment_no: 1, total_installments: 1, amount: 18500, due_date: "2026-10-30", status: "Pending" }
];

export const DEFAULT_RECEIPTS = [
  {
    id: 1,
    payment_id: 1,
    receipt_no: "RCP-2026-001",
    date: "2025-11-28",
    time: "11:20 AM",
    holder_id: 1,
    holder_name: "Amit Sharma",
    policy_no: "LIC-12345",
    plan_name: "Jeevan Labh (Plan 936)",
    amount: 12000,
    late_fee: 0,
    total_amount: 12000,
    payment_method: "UPI",
    reference_no: "UPI-48192801934",
    collector: "Pooja Hegde (Counter Desk #01)",
    period_desc: "Yearly Installment (2025-26)"
  },
  {
    id: 2,
    payment_id: 2,
    receipt_no: "RCP-2026-002",
    date: "2026-04-10",
    time: "02:45 PM",
    holder_id: 2,
    holder_name: "Priya Patel",
    policy_no: "LIC-67890",
    plan_name: "Jeevan Umang (Plan 945)",
    amount: 15000,
    late_fee: 0,
    total_amount: 15000,
    payment_method: "Credit Card",
    reference_no: "POS-CC-90182",
    collector: "Pooja Hegde (Counter Desk #01)",
    period_desc: "Half-Yearly Installment (2026)"
  },
  {
    id: 3,
    payment_id: 3,
    receipt_no: "RCP-2026-003",
    date: "2026-09-17",
    time: "09:30 AM",
    holder_id: 4,
    holder_name: "Sunita Rao",
    policy_no: "LIC-88219",
    plan_name: "Bima Jyoti (Plan 860)",
    amount: 5400,
    late_fee: 0,
    total_amount: 5400,
    payment_method: "Bank Transfer",
    reference_no: "NEFT-SBI-491029",
    collector: "Pooja Hegde (Counter Desk #01)",
    period_desc: "Monthly Installment (Sep 2026)"
  },
  {
    id: 4,
    payment_id: 4,
    receipt_no: "RCP-2026-004",
    date: "2026-10-13",
    time: "10:15 AM",
    holder_id: 5,
    holder_name: "Vikramaditya Singh",
    policy_no: "LIC-55019",
    plan_name: "New Endowment Plan (914)",
    amount: 28000,
    late_fee: 0,
    total_amount: 28000,
    payment_method: "Cheque",
    reference_no: "CHQ-889124 (ICICI Bank)",
    collector: "Pooja Hegde (Counter Desk #01)",
    period_desc: "Yearly Installment (2026-27)"
  }
];

export const DEFAULT_RECONCILIATION = [
  {
    id: 1,
    date: "2026-10-13",
    channel: "Cheque Clearing",
    expected: 28000,
    actual: 28000,
    variance: 0,
    status: "Reconciled",
    reconciled_by: "Pooja Hegde (Cashier)",
    notes: "Cheque CHQ-889124 cleared through clearing house"
  },
  {
    id: 2,
    date: "2026-10-12",
    channel: "UPI & Digital Channels",
    expected: 34500,
    actual: 34500,
    variance: 0,
    status: "Reconciled",
    reconciled_by: "System Batch Sync",
    notes: "Payment gateway nodal account match 100%"
  },
  {
    id: 3,
    date: "2026-10-11",
    channel: "Counter Cash Deposits",
    expected: 15000,
    actual: 15000,
    variance: 0,
    status: "Reconciled",
    reconciled_by: "Vikramaditya Singh (Admin)",
    notes: "Cash vault handed over to SBI bullion carrier"
  },
  {
    id: 4,
    date: "2026-10-10",
    channel: "POS Card Swipes",
    expected: 22000,
    actual: 21850,
    variance: -150,
    status: "Audited / Adjusted",
    reconciled_by: "Pooja Hegde (Cashier)",
    notes: "MDR merchant discount fee deducted by acquiring bank"
  }
];

export const DEFAULT_NOTIFICATIONS = [
  { id: 1, title: "Cheque Cleared", text: "Vikramaditya Singh's ₹28,000 cheque credited.", time: "15m ago", type: "success" },
  { id: 2, title: "Grace Period Alert", text: "Priya Patel's premium due in 12 days (LIC-67890).", time: "1h ago", type: "info" },
  { id: 3, title: "Overdue Reminder", text: "Rahul Verma (LIC-34102) has crossed grace window.", time: "3h ago", type: "alert" }
];

export const DEFAULT_USERS = [
  {
    id: "admin",
    username: "admin",
    password: "lic123",
    name: "Vikramaditya Singh",
    role: "Admin",
    email: "admin@dataalcott.com",
    title: "Branch Manager",
    deskId: "HQ-Executive-01",
    avatar: "VS",
    permissions: "Full branch management, audit, user controls & approvals"
  },
  {
    id: "cashier1",
    username: "cashier1",
    password: "lic123",
    name: "Pooja Hegde",
    role: "Cashier",
    email: "pooja.c01@dataalcott.com",
    title: "Counter Cashier",
    deskId: "Desk #01",
    avatar: "PH",
    permissions: "Counter collection, physical & digital payment processing, receipt minting"
  },
  {
    id: "agent1",
    username: "agent1",
    password: "lic123",
    name: "R. K. Verma",
    role: "Agent",
    email: "rk.verma@dataalcott.com",
    title: "Senior Life Advisor",
    agentCode: "AG-102",
    avatar: "RV",
    permissions: "Assigned client portfolio management, reminders, sales onboarding"
  },
  {
    id: "holder_amit",
    username: "holder_amit",
    password: "lic123",
    name: "Amit Sharma",
    role: "Policyholder",
    email: "amit.sharma@example.com",
    title: "Insured Member",
    policyNo: "LIC-12345",
    holderId: 1,
    avatar: "AS",
    permissions: "Self-service policy portal, online renewals, tax certificates"
  }
];

export function generateAdditionalHoldersAndInstallments(baseHolders, baseInstallments, count = 2000) {
  const firstNames = [
    'Aarav', 'Aditi', 'Advik', 'Akshay', 'Alok', 'Amit', 'Anand', 'Ananya', 'Anil', 'Anita',
    'Anjali', 'Ansh', 'Anurag', 'Archana', 'Arjun', 'Aryan', 'Ashok', 'Avinash', 'Bhavana', 'Chetan',
    'Darshan', 'Deepa', 'Deepak', 'Deepika', 'Dev', 'Divya', 'Ganesh', 'Gaurav', 'Gayatri', 'Geeta',
    'Gopal', 'Harish', 'Harsh', 'Hemant', 'Ishaan', 'Ishita', 'Jagdish', 'Jay', 'Jitendra', 'Jyoti',
    'Kabir', 'Kalpana', 'Kapil', 'Karan', 'Karthik', 'Kavita', 'Kiran', 'Kishore', 'Krishna', 'Krunal',
    'Kuldeep', 'Kumar', 'Kunal', 'Lakshmi', 'Lalit', 'Madhav', 'Madhu', 'Mahesh', 'Malini', 'Manish',
    'Manoj', 'Mayank', 'Meena', 'Meera', 'Mohan', 'Mukesh', 'Murali', 'Naresh', 'Neha', 'Nikhil',
    'Nilesh', 'Niraj', 'Nisha', 'Nitin', 'Pankaj', 'Parth', 'Parvati', 'Pooja', 'Poonam', 'Pradeep',
    'Prakash', 'Prashant', 'Prateek', 'Pratibha', 'Pravin', 'Prem', 'Priya', 'Priyanka', 'Puneet', 'Radhika',
    'Rahul', 'Raj', 'Rajan', 'Rajat', 'Rajeev', 'Rajendra', 'Rajesh', 'Rakesh', 'Ramesh', 'Rashmi',
    'Ravi', 'Ravindra', 'Rekha', 'Renuka', 'Reyansh', 'Rishi', 'Ritu', 'Rohit', 'Roshan', 'Rupa',
    'Sachin', 'Sagar', 'Sai', 'Sameer', 'Sandeep', 'Sangeeta', 'Sanjay', 'Sanjeev', 'Santosh', 'Sarita',
    'Satish', 'Saurabh', 'Seema', 'Shailesh', 'Shankar', 'Shanti', 'Sharad', 'Shikha', 'Shiv', 'Shobha',
    'Shruti', 'Siddharth', 'Smita', 'Sneha', 'Somesh', 'Sonal', 'Sonam', 'Subhash', 'Sudha', 'Sudhir',
    'Sujay', 'Suman', 'Sunil', 'Sunita', 'Suresh', 'Suraj', 'Sushma', 'Swapnil', 'Swati', 'Tanvi',
    'Tarun', 'Tejas', 'Uday', 'Uma', 'Umesh', 'Urmila', 'Utkarsh', 'Vaibhav', 'Vaishali', 'Varun',
    'Ved', 'Veena', 'Venkatesh', 'Vibha', 'Vidya', 'Vijay', 'Vikas', 'Vikram', 'Vinay', 'Vinod',
    'Vipin', 'Virendra', 'Vishal', 'Vivek', 'Yash', 'Yogesh'
  ];

  const lastNames = [
    'Acharya', 'Agarwal', 'Agnihotri', 'Ahuja', 'Ambani', 'Anand', 'Apte', 'Arora', 'Bagchi', 'Bakshi',
    'Banerjee', 'Bansal', 'Barman', 'Basu', 'Bedi', 'Bhasin', 'Bhat', 'Bhatia', 'Bhattacharya', 'Bhonsle',
    'Biswas', 'Bora', 'Bose', 'Chakrabarti', 'Chakraborty', 'Chandra', 'Chatterjee', 'Chauhan', 'Chawla', 'Chopra',
    'Choudhury', 'Dalal', 'Das', 'Dasgupta', 'Date', 'Dave', 'De', 'Desai', 'Deshmukh', 'Deshpande',
    'Dewan', 'Dey', 'Dhar', 'Dixit', 'Doshi', 'Dubey', 'Dutta', 'Fernandes', 'Ganguly', 'Garg',
    'Ghosh', 'Ghoshal', 'Goel', 'Gokhale', 'Goswami', 'Grover', 'Guha', 'Gulati', 'Gupta', 'Hegde',
    'Iyengar', 'Iyer', 'Jadhav', 'Jain', 'Jaiswal', 'Jani', 'Jha', 'Johar', 'Joshi', 'Juneja',
    'Kale', 'Kamath', 'Kapoor', 'Kar', 'Karkera', 'Karmakar', 'Kashyap', 'Kaul', 'Kaur', 'Kelkar',
    'Khan', 'Khanna', 'Khatri', 'Khosla', 'Kirloskar', 'Kochhar', 'Kohli', 'Kothari', 'Kulkarni', 'Kumar',
    'Kundu', 'Lahiri', 'Lal', 'Mahajan', 'Maitra', 'Majumdar', 'Malhotra', 'Malik', 'Mallick', 'Mandal',
    'Mani', 'Mathur', 'Mazumdar', 'Mehra', 'Mehta', 'Menon', 'Mishra', 'Mitra', 'Mitter', 'Modi',
    'Mohanty', 'Mondal', 'Mukherjee', 'Murthy', 'Nadkarni', 'Nag', 'Naik', 'Nair', 'Nambiar', 'Namboodiri',
    'Nanda', 'Narang', 'Narayan', 'Narula', 'Nayak', 'Nayyar', 'Negi', 'Nigam', 'Pai', 'Pal',
    'Pandit', 'Pandya', 'Panicker', 'Pant', 'Parashar', 'Parekh', 'Patel', 'Patil', 'Patnaik', 'Paul',
    'Phadke', 'Pillai', 'Prabhu', 'Prasad', 'Pujari', 'Puri', 'Radhakrishnan', 'Raghavan', 'Rai', 'Raina',
    'Raj', 'Rajagopal', 'Rajan', 'Rajput', 'Raju', 'Ram', 'Ramachandran', 'Raman', 'Ramanathan', 'Ramaswamy',
    'Rana', 'Ranganathan', 'Rao', 'Rastogi', 'Rathi', 'Rawat', 'Ray', 'Reddy', 'Roy', 'Roychowdhury',
    'Sahay', 'Sahni', 'Sahu', 'Saini', 'Samanta', 'Sangma', 'Sanyal', 'Saran', 'Saraswat', 'Sarin',
    'Sarkar', 'Saxena', 'Sehgal', 'Sen', 'Sengupta', 'Seth', 'Sethi', 'Shah', 'Sharma', 'Shastri',
    'Sheth', 'Shetty', 'Shinde', 'Shukla', 'Singh', 'Singhal', 'Singhania', 'Sinha', 'Som', 'Soman',
    'Soni', 'Sood', 'Srinivasan', 'Srivastava', 'Subramanian', 'Sundaram', 'Suri', 'Swaminathan', 'Talwar', 'Tandon',
    'Tarafdar', 'Tewari', 'Thakur', 'Thampi', 'Thapar', 'Tiwari', 'Tripathi', 'Trivedi', 'Upadhyay', 'Varma',
    'Ved', 'Venkatesh', 'Venkataraman', 'Verma', 'Vidyarthi', 'Vijay', 'Vohra', 'Vyas', 'Wadhwa', 'Wagle',
    'Walia', 'Warrier', 'Yadav'
  ];

  const plans = [
    'Jeevan Labh (Plan 936)', 'Jeevan Umang (Plan 945)', 'Tech Term (Plan 854)',
    'Bima Jyoti (Plan 860)', 'New Endowment Plan (914)', 'Jeevan Anand (Plan 915)',
    'SIIP (Plan 852)', 'Nivesh Plus (Plan 849)', 'Cancer Cover (Plan 905)',
    'Arogya Rakshak (Plan 906)', 'Saral Pension (Plan 862)', 'Jeevan Lakshya (Plan 933)',
    'Jeevan Amar (Plan 855)', 'Bima Ratna (Plan 864)', 'Dhan Rekha (Plan 863)', 'Yuva Term (Plan 875)'
  ];

  const freqs = ['Yearly', 'Yearly', 'Yearly', 'Half-Yearly', 'Half-Yearly', 'Quarterly', 'Quarterly', 'Monthly', 'Single Premium'];
  const sumAssureds = [300000, 500000, 750000, 1000000, 1500000, 2000000, 2500000, 5000000];
  const premiums = [3600, 5400, 7200, 9500, 12000, 15500, 18000, 22500, 28000, 36000, 45000];
  const relations = ['Spouse', 'Son', 'Daughter', 'Mother', 'Father', 'Brother'];
  const agents = [
    'R. K. Verma (AG-102)', 'Meera Sen (AG-109)', 'S. K. Joshi (AG-115)',
    'K. S. Sundaram (AGT-9921)', 'Anjali Nair (AG-204)', 'Prakash Rao (AG-312)'
  ];

  const extraHolders = [];
  const extraInstallments = [];
  const startId = (baseHolders.reduce((max, h) => Math.max(max, h.id), 0) || 0) + 1;
  let nextInstId = (baseInstallments.reduce((max, i) => Math.max(max, i.id), 0) || 0) + 1;

  for (let i = 0; i < count; i++) {
    const id = startId + i;
    const fn = firstNames[i % firstNames.length];
    const ln = lastNames[Math.floor(i / firstNames.length) % lastNames.length];
    const name = `${fn} ${ln}`;
    const policyNo = 'LIC-' + (10001 + i);
    const plan = plans[i % plans.length];
    const freq = freqs[i % freqs.length];
    const sum = sumAssureds[i % sumAssureds.length];
    const prem = premiums[i % premiums.length];
    const agent = agents[i % agents.length];

    let dYear = 2026;
    let dMonth = 10;
    let dDay = 1 + (i % 28);
    const pattern = i % 10;
    if (pattern === 0) {
      dMonth = 8;
    } else if (pattern === 1) {
      dMonth = 9;
    } else if (pattern === 2 || pattern === 3) {
      dMonth = 10;
      dDay = Math.min(dDay, 12);
    } else if (pattern <= 6) {
      dMonth = 10 + (i % 3);
      if (dMonth > 12) { dMonth -= 12; dYear = 2027; }
    } else {
      dYear = 2027;
      dMonth = 1 + (i % 8);
    }

    const mStr = String(dMonth).padStart(2, '0');
    const dStr = String(dDay).padStart(2, '0');
    const dueDate = `${dYear}-${mStr}-${dStr}`;

    const phoneRest = String(10000000 + ((i * 7919) % 90000000));
    const phone = `+91 ${7 + (i % 3)}${phoneRest.substring(0, 4)} ${phoneRest.substring(4, 9)}`;
    const email = `${fn.toLowerCase()}.${ln.toLowerCase()}${id}@example.com`;
    const nominee = `${fn} ${ln} (${relations[i % relations.length]})`;

    extraHolders.push({
      id,
      name,
      policy_number: policyNo,
      plan_name: plan,
      sum_assured: sum,
      premium_amount: prem,
      payment_frequency: freq,
      next_due_date: dueDate,
      phone,
      email,
      nominee,
      agent_name: agent
    });

    let instStatus = 'Pending';
    if (pattern === 0 || pattern === 1) instStatus = 'Overdue';
    else if (i % 5 === 0) instStatus = 'Paid';

    extraInstallments.push({
      id: nextInstId++,
      holder_id: id,
      installment_no: (i % 10) + 1,
      total_installments: freq === 'Single Premium' ? 1 : 20,
      amount: prem,
      due_date: dueDate,
      status: instStatus
    });
  }

  return {
    allHolders: [...baseHolders, ...extraHolders],
    allInstallments: [...baseInstallments, ...extraInstallments]
  };
}

const SEED_DATA = generateAdditionalHoldersAndInstallments(DEFAULT_HOLDERS, DEFAULT_INSTALLMENTS, 2000);
export const ALL_SEED_HOLDERS = SEED_DATA.allHolders;
export const ALL_SEED_INSTALLMENTS = SEED_DATA.allInstallments;
