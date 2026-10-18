/**
 * PremiumCollect - Comprehensive Insurance Premium Collection System
 * Free Web Development Internship Online Task: WD-LIC-003
 * Student Code: DAS-LIC-003
 * Organization: Data Alcott Systems (www.dataalcott.com | freeinternships.in)
 * Domain: Premium Collection & Financial Accounting (LIC standard)
 */

(function () {
  'use strict';

  // =========================================================================
  // 1. Safe Storage Abstraction (Works in file://, HTTP, Private Browsing)
  // =========================================================================
  const memoryFallback = {};
  const safeStorage = {
    getItem(key) {
      try {
        if (typeof window !== 'undefined' && window.localStorage) {
          const val = window.localStorage.getItem(key);
          if (val !== null) return val;
        }
      } catch (e) {
        // Fallback to memory
      }
      return memoryFallback[key] !== undefined ? memoryFallback[key] : null;
    },
    setItem(key, value) {
      try {
        if (typeof window !== 'undefined' && window.localStorage) {
          window.localStorage.setItem(key, value);
        }
      } catch (e) {
        // Fallback to memory
      }
      memoryFallback[key] = String(value);
    },
    removeItem(key) {
      try {
        if (typeof window !== 'undefined' && window.localStorage) {
          window.localStorage.removeItem(key);
        }
      } catch (e) {
        // Fallback to memory
      }
      delete memoryFallback[key];
    }
  };

  const STORAGE_KEYS = {
    USERS: 'premiumcollect_users',
    CURRENT_USER: 'premiumcollect_current_user',
    HOLDERS: 'premiumcollect_holders',
    PAYMENTS: 'premiumcollect_payments',
    INSTALLMENTS: 'premiumcollect_installments',
    RECEIPTS: 'premiumcollect_receipts',
    RECONCILIATION: 'premiumcollect_reconciliation',
    NOTIFICATIONS: 'premiumcollect_notifications',
    ROLE: 'premiumcollect_user_role',
    THEME: 'premiumcollect_theme'
  };

  // Seed sample data matching task guidelines (Amit Sharma, Priya Patel, etc.)
  const DEFAULT_HOLDERS = [
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
      next_due_date: "2026-10-25", // In grace period
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
      next_due_date: "2026-09-10", // Overdue > 30 days
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

  const DEFAULT_PAYMENTS = [
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
      paid_date: new Date().toISOString().split('T')[0],
      status: "Paid",
      payment_method: "Cheque",
      reference_no: "CHQ-889124 (ICICI Bank)",
      receipt_no: "RCP-2026-004",
      collector: "Pooja Hegde (Desk #01)",
      notes: "Annual premium cheque deposited and cleared"
    }
  ];

  const DEFAULT_INSTALLMENTS = [
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

  // -------------------------------------------------------------------------
  // Generator for 2,000 Additional Indian Policy Holders & Schedules
  // -------------------------------------------------------------------------
  function generateAdditionalHoldersAndInstallments(baseHolders, baseInstallments, count = 2000) {
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
        dMonth = 8; // Overdue > 30 days
      } else if (pattern === 1) {
        dMonth = 9; // Overdue in Sept
      } else if (pattern === 2 || pattern === 3) {
        dMonth = 10;
        dDay = Math.min(dDay, 12); // Grace period
      } else if (pattern <= 6) {
        dMonth = 10 + (i % 3); // Oct, Nov, Dec 2026
        if (dMonth > 12) { dMonth -= 12; dYear = 2027; }
      } else {
        dYear = 2027;
        dMonth = 1 + (i % 8); // 2027
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
  const ALL_SEED_HOLDERS = SEED_DATA.allHolders;
  const ALL_SEED_INSTALLMENTS = SEED_DATA.allInstallments;

  const DEFAULT_RECEIPTS = [
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

  const DEFAULT_RECONCILIATION = [
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

  const DEFAULT_NOTIFICATIONS = [
    { id: 1, title: "Cheque Cleared", text: "Vikramaditya Singh's ₹28,000 cheque credited.", time: "15m ago", type: "success" },
    { id: 2, title: "Grace Period Alert", text: "Priya Patel's premium due in 12 days (LIC-67890).", time: "1h ago", type: "info" },
    { id: 3, title: "Overdue Reminder", text: "Rahul Verma (LIC-34102) has crossed grace window.", time: "3h ago", type: "alert" }
  ];

  const DEFAULT_USERS = [
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

  function loadJsonFromStorage(key, fallback) {
    try {
      const data = safeStorage.getItem(key);
      return data ? JSON.parse(data) : fallback;
    } catch (e) {
      return fallback;
    }
  }

  function loadHoldersFromStorage() {
    let saved = loadJsonFromStorage(STORAGE_KEYS.HOLDERS, null);
    if (!saved || !Array.isArray(saved) || saved.length < 2000) {
      saved = ALL_SEED_HOLDERS;
      safeStorage.setItem(STORAGE_KEYS.HOLDERS, JSON.stringify(saved));
    }
    return saved;
  }

  function loadInstallmentsFromStorage() {
    let saved = loadJsonFromStorage(STORAGE_KEYS.INSTALLMENTS, null);
    if (!saved || !Array.isArray(saved) || saved.length < 2000) {
      saved = ALL_SEED_INSTALLMENTS;
      safeStorage.setItem(STORAGE_KEYS.INSTALLMENTS, JSON.stringify(saved));
    }
    return saved;
  }

  // Application State
  const state = {
    users: loadJsonFromStorage(STORAGE_KEYS.USERS, DEFAULT_USERS),
    currentUser: loadJsonFromStorage(STORAGE_KEYS.CURRENT_USER, DEFAULT_USERS[1]), // Default to cashier Pooja
    holders: loadHoldersFromStorage(),
    payments: loadJsonFromStorage(STORAGE_KEYS.PAYMENTS, DEFAULT_PAYMENTS),
    installments: loadInstallmentsFromStorage(),
    receipts: loadJsonFromStorage(STORAGE_KEYS.RECEIPTS, DEFAULT_RECEIPTS),
    reconciliation: loadJsonFromStorage(STORAGE_KEYS.RECONCILIATION, DEFAULT_RECONCILIATION),
    notifications: loadJsonFromStorage(STORAGE_KEYS.NOTIFICATIONS, DEFAULT_NOTIFICATIONS),
    currentRole: safeStorage.getItem(STORAGE_KEYS.ROLE) || 'Cashier',
    currentTheme: safeStorage.getItem(STORAGE_KEYS.THEME) || 'light',
    activeReceiptId: 4,
    charts: {}
  };

  function persistAll() {
    safeStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(state.users));
    safeStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(state.currentUser));
    safeStorage.setItem(STORAGE_KEYS.HOLDERS, JSON.stringify(state.holders));
    safeStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(state.payments));
    safeStorage.setItem(STORAGE_KEYS.INSTALLMENTS, JSON.stringify(state.installments));
    safeStorage.setItem(STORAGE_KEYS.RECEIPTS, JSON.stringify(state.receipts));
    safeStorage.setItem(STORAGE_KEYS.RECONCILIATION, JSON.stringify(state.reconciliation));
    safeStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(state.notifications));
  }

  // =========================================================================
  // 2. Formatting Helpers (INR Currency, Date, Words)
  // =========================================================================
  function formatINR(amount) {
    if (amount === undefined || amount === null || isNaN(amount)) return '₹0.00';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2
    }).format(amount);
  }

  function formatDate(dateStr) {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  }

  function getDaysDifference(targetDateStr) {
    if (!targetDateStr) return 0;
    const target = new Date(targetDateStr);
    const now = new Date();
    target.setHours(0, 0, 0, 0);
    now.setHours(0, 0, 0, 0);
    const diffTime = target.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  function numberToWordsINR(amount) {
    const a = ['', 'One ', 'Two ', 'Three ', 'Four ', 'Five ', 'Six ', 'Seven ', 'Eight ', 'Nine ', 'Ten ', 'Eleven ', 'Twelve ', 'Thirteen ', 'Fourteen ', 'Fifteen ', 'Sixteen ', 'Seventeen ', 'Eighteen ', 'Nineteen '];
    const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

    function inWords(num) {
      if ((num = num.toString()).length > 9) return 'Overflow';
      const n = ('000000000' + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
      if (!n) return '';
      let str = '';
      str += (n[1] != 0) ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'Crore ' : '';
      str += (n[2] != 0) ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'Lakh ' : '';
      str += (n[3] != 0) ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'Thousand ' : '';
      str += (n[4] != 0) ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'Hundred ' : '';
      str += (n[5] != 0) ? ((str != '') ? 'and ' : '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) : '';
      return str.trim();
    }

    const words = inWords(Math.floor(amount));
    return (words ? words + " Rupees Only" : "Zero Rupees Only");
  }

  function showToast(title, message, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    let iconClass = 'fa-solid fa-circle-check';
    if (type === 'error') iconClass = 'fa-solid fa-circle-xmark';
    if (type === 'warning') iconClass = 'fa-solid fa-triangle-exclamation';
    if (type === 'info') iconClass = 'fa-solid fa-circle-info';

    toast.innerHTML = `
      <i class="${iconClass} toast-icon"></i>
      <div class="toast-body">
        <div class="toast-title">${escapeHTML(title)}</div>
        <div class="toast-message">${escapeHTML(message)}</div>
      </div>
      <button class="toast-close" aria-label="Close">&times;</button>
    `;

    toast.querySelector('.toast-close').addEventListener('click', () => {
      toast.classList.add('toast-fadeout');
      setTimeout(() => toast.remove(), 250);
    });

    container.appendChild(toast);

    setTimeout(() => {
      if (toast.parentElement) {
        toast.classList.add('toast-fadeout');
        setTimeout(() => toast.remove(), 250);
      }
    }, 4000);
  }

  function escapeHTML(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  // =========================================================================
  // 3. User Authentication, Roles & Persona Management (User-Dependent Scope)
  // =========================================================================
  let userScopedFilters = {
    holdersShowAll: false,
    installmentsShowAll: false,
    dueDatesShowAll: false,
    receiptsShowAll: false
  };

  function setCurrentUser(user, options = {}) {
    if (!user) return;
    state.currentUser = user;
    state.currentRole = user.role;
    safeStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    safeStorage.setItem(STORAGE_KEYS.ROLE, user.role);

    // Reset user view toggles when switching persona
    userScopedFilters = {
      holdersShowAll: false,
      installmentsShowAll: false,
      dueDatesShowAll: false,
      receiptsShowAll: false
    };

    updateUserUI();

    if (!options.silent) {
      showToast('Session Switched', `Logged in as ${user.name} (${user.role})`, 'success');
    }

    // Refresh active section data based on new user context
    const activeSection = document.querySelector('.content-section.active')?.id || 'dashboard';
    if (activeSection === 'dashboard') updateDashboard();
    else if (activeSection === 'holders') renderHoldersTable();
    else if (activeSection === 'payment') populatePaymentHoldersDropdown();
    else if (activeSection === 'installments') renderInstallmentsTable();
    else if (activeSection === 'due-dates') renderDueDatesTable();
    else if (activeSection === 'receipt') renderReceiptView();
    else if (activeSection === 'history') renderHistoryTable();
    else if (activeSection === 'reconciliation') renderReconciliationTable();
    else if (activeSection === 'reports') generateSelectedReport();
  }

  function updateUserUI() {
    const user = state.currentUser || DEFAULT_USERS[1];

    // Avatar
    const avatarEl = document.getElementById('user-avatar');
    if (avatarEl) {
      avatarEl.textContent = user.avatar || user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    }

    // Topbar display name & role tag
    const displayNameEl = document.getElementById('user-display-name');
    if (displayNameEl) displayNameEl.textContent = user.name;

    const roleTagEl = document.getElementById('user-role-tag');
    if (roleTagEl) {
      const codeOrDesk = user.deskId || user.agentCode || user.policyNo || user.title || user.role;
      roleTagEl.textContent = `${user.role} • ${codeOrDesk}`;
    }

    // Topbar role dropdown selector
    const roleSelect = document.getElementById('user-role-select');
    if (roleSelect && roleSelect.value !== user.role) {
      roleSelect.value = user.role;
    }

    // User Scope Banner below header
    const scopeBanner = document.getElementById('user-scope-banner');
    const scopeBadge = document.getElementById('user-scope-badge');
    const scopeText = document.getElementById('user-scope-text');

    if (scopeBanner) {
      scopeBanner.className = `user-scope-banner scope-${user.role.toLowerCase()}`;
      if (scopeBadge) {
        let badgeIcon = 'fa-solid fa-crown';
        if (user.role === 'Cashier') badgeIcon = 'fa-solid fa-cash-register';
        else if (user.role === 'Agent') badgeIcon = 'fa-solid fa-handshake';
        else if (user.role === 'Policyholder') badgeIcon = 'fa-solid fa-user-shield';
        scopeBadge.innerHTML = `<i class="${badgeIcon}"></i> ${user.role} Session`;
      }
      if (scopeText) {
        if (user.role === 'Admin') {
          scopeText.innerHTML = `Operating as <strong>${escapeHTML(user.name)}</strong> (${user.title || 'Branch Manager'}) • Full administrative, audit & settlement clearance`;
        } else if (user.role === 'Cashier') {
          scopeText.innerHTML = `Operating as <strong>${escapeHTML(user.name)}</strong> (${user.deskId || 'Desk #01'}) • Counter premium intake & instant receipt minting`;
        } else if (user.role === 'Agent') {
          scopeText.innerHTML = `Operating as <strong>${escapeHTML(user.name)}</strong> (${user.agentCode || 'AG-102'}) • Client servicing & portfolio renewal collection`;
        } else if (user.role === 'Policyholder') {
          scopeText.innerHTML = `Insured Member: <strong>${escapeHTML(user.name)}</strong> (Policy: <code>${user.policyNo || 'LIC-12345'}</code>) • Self-service portal & online payment`;
        }
      }
    }

    // Profile Modal elements
    const pAvatar = document.getElementById('modal-profile-avatar');
    if (pAvatar) pAvatar.textContent = user.avatar || user.name.substring(0, 2).toUpperCase();

    const pName = document.getElementById('modal-profile-name');
    if (pName) pName.textContent = user.name;

    const pBadge = document.getElementById('modal-profile-role-badge');
    if (pBadge) {
      pBadge.textContent = `${user.role} • ${user.title || ''}`;
      pBadge.className = `badge mt-1 ${user.role === 'Admin' ? 'badge-warning' : user.role === 'Cashier' ? 'badge-success' : user.role === 'Agent' ? 'badge-info' : 'badge-neutral'}`;
    }

    const pUsername = document.getElementById('modal-profile-username');
    if (pUsername) pUsername.textContent = user.username || user.id;

    const pEmail = document.getElementById('modal-profile-email');
    if (pEmail) pEmail.textContent = user.email || 'N/A';

    const pCode = document.getElementById('modal-profile-code');
    if (pCode) pCode.textContent = user.deskId || user.agentCode || user.policyNo || 'Headquarters';

    const pTier = document.getElementById('modal-profile-tier');
    if (pTier) pTier.textContent = user.permissions || 'Standard Access';

    // Apply role-based button & UI restrictions
    applyRolePermissions(user);
  }

  function applyRolePermissions(user) {
    const addHolderBtn = document.getElementById('btn-open-add-holder-modal');
    const heroAddBtn = document.getElementById('hero-add-holder-btn');
    const bulkModalBtn = document.getElementById('btn-open-bulk-modal');
    const runAutoReconBtn = document.getElementById('btn-run-auto-reconciliation');

    if (user.role === 'Policyholder') {
      if (addHolderBtn) addHolderBtn.style.display = 'none';
      if (heroAddBtn) heroAddBtn.style.display = 'none';
      if (bulkModalBtn) bulkModalBtn.style.display = 'none';
      if (runAutoReconBtn) {
        runAutoReconBtn.disabled = true;
        runAutoReconBtn.title = "Restricted to Branch Cashiers & Administrators";
      }
    } else {
      if (addHolderBtn) addHolderBtn.style.display = '';
      if (heroAddBtn) heroAddBtn.style.display = '';
      if (bulkModalBtn) bulkModalBtn.style.display = '';
      if (runAutoReconBtn) {
        runAutoReconBtn.disabled = false;
        runAutoReconBtn.title = "Auto Reconcile Payments";
      }
    }
  }

  function initAuth() {
    // Open Auth Modal via header Account button
    document.getElementById('btn-open-auth-modal')?.addEventListener('click', () => {
      openModal('modal-auth');
    });

    // Banner Switch Button
    document.getElementById('btn-banner-switch-user')?.addEventListener('click', () => {
      openModal('modal-auth');
    });

    // Profile Pill Click opens Profile Modal
    document.querySelector('.user-profile-pill')?.addEventListener('click', () => {
      openModal('modal-profile');
    });

    // Tabs inside Auth Modal
    const tabLogin = document.getElementById('tab-btn-login');
    const tabRegister = document.getElementById('tab-btn-register');
    const panelLogin = document.getElementById('auth-panel-login');
    const panelRegister = document.getElementById('auth-panel-register');

    tabLogin?.addEventListener('click', () => {
      tabLogin.classList.add('active');
      tabRegister?.classList.remove('active');
      panelLogin?.classList.remove('hidden');
      panelRegister?.classList.add('hidden');
    });

    tabRegister?.addEventListener('click', () => {
      tabRegister.classList.add('active');
      tabLogin?.classList.remove('active');
      panelRegister?.classList.remove('hidden');
      panelLogin?.classList.add('hidden');
    });

    // 1-Click Persona Buttons
    document.querySelectorAll('.btn-persona').forEach(btn => {
      btn.addEventListener('click', () => {
        const userId = btn.dataset.user;
        const matched = state.users.find(u => u.id === userId || u.username === userId);
        if (matched) {
          setCurrentUser(matched);
          closeModal('modal-auth');
        } else {
          showToast('Error', 'User persona not found.', 'error');
        }
      });
    });

    // Login Form Submit
    document.getElementById('form-auth-login')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const usernameInput = document.getElementById('login-username').value.trim().toLowerCase();
      const passwordInput = document.getElementById('login-password').value;

      const found = state.users.find(u => 
        (u.username && u.username.toLowerCase() === usernameInput) ||
        (u.email && u.email.toLowerCase() === usernameInput) ||
        (u.id && u.id.toLowerCase() === usernameInput)
      );

      if (found) {
        if (!found.password || found.password === passwordInput || passwordInput === 'lic123') {
          setCurrentUser(found);
          closeModal('modal-auth');
          document.getElementById('form-auth-login').reset();
        } else {
          showToast('Invalid Credentials', 'Incorrect password. Default is "lic123"', 'error');
        }
      } else {
        const newUser = {
          id: 'user_' + Date.now(),
          username: usernameInput,
          password: passwordInput,
          name: usernameInput.charAt(0).toUpperCase() + usernameInput.slice(1),
          role: 'Cashier',
          email: `${usernameInput}@dataalcott.com`,
          title: 'Counter Operator',
          deskId: 'Desk #02',
          avatar: usernameInput.substring(0, 2).toUpperCase(),
          permissions: 'Counter collection and receipt issue'
        };
        state.users.push(newUser);
        persistAll();
        setCurrentUser(newUser);
        closeModal('modal-auth');
        showToast('Account Created', `Logged in as ${newUser.name}`, 'success');
      }
    });

    // Register Form Submit
    document.getElementById('form-auth-register')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('reg-fullname').value.trim();
      const username = document.getElementById('reg-username').value.trim().toLowerCase();
      const email = document.getElementById('reg-email').value.trim();
      const role = document.getElementById('reg-role').value;
      const code = document.getElementById('reg-code').value.trim();
      const password = document.getElementById('reg-password').value;

      if (!name || !username || !email) {
        showToast('Validation Error', 'Please complete all required fields.', 'error');
        return;
      }

      const existing = state.users.find(u => u.username === username || u.email === email);
      if (existing) {
        showToast('Username Taken', 'An account with this username or email already exists.', 'warning');
        return;
      }

      const avatar = name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || username.substring(0, 2).toUpperCase();

      const newUser = {
        id: 'usr_' + Date.now(),
        username,
        password,
        name,
        role,
        email,
        title: role === 'Admin' ? 'Branch Administrator' : role === 'Agent' ? 'Field Insurance Advisor' : role === 'Policyholder' ? 'Insured Policyholder' : 'Counter Cashier',
        deskId: role === 'Cashier' ? (code || 'Desk #02') : undefined,
        agentCode: role === 'Agent' ? (code || `AG-${Math.floor(100 + Math.random() * 900)}`) : undefined,
        policyNo: role === 'Policyholder' ? (code || `LIC-${Math.floor(10000 + Math.random() * 90000)}`) : undefined,
        avatar,
        permissions: role === 'Admin' ? 'Full branch management & audit controls' : role === 'Cashier' ? 'Counter premium collection & receipts' : role === 'Agent' ? 'Assigned client servicing' : 'Self-service policy portal'
      };

      if (role === 'Policyholder') {
        const policyNo = newUser.policyNo;
        const existsInHolders = state.holders.some(h => h.policy_number === policyNo);
        if (!existsInHolders) {
          const newHolderId = (state.holders.reduce((m, h) => Math.max(m, h.id), 0) || 0) + 1;
          state.holders.push({
            id: newHolderId,
            name: newUser.name,
            policy_number: policyNo,
            plan_name: 'Jeevan Labh (Plan 936)',
            sum_assured: 500000,
            premium_amount: 12000,
            payment_frequency: 'Yearly',
            next_due_date: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
            phone: '+91 98765 00000',
            email: newUser.email,
            nominee: 'Family Nominee',
            agent_name: 'R. K. Verma (AG-102)'
          });
          newUser.holderId = newHolderId;
        }
      }

      state.users.push(newUser);
      persistAll();
      setCurrentUser(newUser);
      closeModal('modal-auth');
      document.getElementById('form-auth-register').reset();
      showToast('Registration Successful', `Welcome, ${newUser.name}! Logged in as ${role}.`, 'success');
    });

    // Profile modal buttons
    document.getElementById('btn-profile-switch-account')?.addEventListener('click', () => {
      closeModal('modal-profile');
      openModal('modal-auth');
    });

    document.getElementById('btn-profile-logout')?.addEventListener('click', () => {
      closeModal('modal-profile');
      setCurrentUser(DEFAULT_USERS[1], { silent: true });
      showToast('Logged Out', 'Switched to standard Counter Cashier session.', 'info');
    });

    // Sync header role select with users
    const roleSelect = document.getElementById('user-role-select');
    roleSelect?.addEventListener('change', (e) => {
      const targetRole = e.target.value;
      const matchingUser = state.users.find(u => u.role === targetRole);
      if (matchingUser) {
        setCurrentUser(matchingUser);
      } else {
        state.currentUser.role = targetRole;
        state.currentRole = targetRole;
        safeStorage.setItem(STORAGE_KEYS.ROLE, targetRole);
        safeStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(state.currentUser));
        updateUserUI();
        showToast('Role Updated', `Switched role to ${targetRole}`, 'info');
      }
    });

    // Initial UI populate
    updateUserUI();
  }

  // =========================================================================
  // 4. Navigation & Layout Handling
  // =========================================================================
  function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link, .navigate-link');
    const sections = document.querySelectorAll('.content-section');
    const pageTitle = document.getElementById('current-page-title');
    const toggleBtn = document.getElementById('sidebar-toggle-btn');
    const closeBtn = document.getElementById('sidebar-close-btn');
    const overlay = document.getElementById('sidebar-overlay');
    const sidebar = document.getElementById('sidebar');

    function openMobileSidebar() {
      sidebar?.classList.add('open');
      overlay?.classList.add('open');
    }

    function closeMobileSidebar() {
      sidebar?.classList.remove('open');
      overlay?.classList.remove('open');
    }

    function setActiveSection(targetSectionId) {
      if (!targetSectionId) targetSectionId = 'dashboard';
      targetSectionId = targetSectionId.replace('#', '');

      let matched = false;
      sections.forEach(sec => {
        if (sec.id === targetSectionId) {
          sec.classList.add('active');
          matched = true;
        } else {
          sec.classList.remove('active');
        }
      });

      if (!matched) {
        document.getElementById('dashboard')?.classList.add('active');
        targetSectionId = 'dashboard';
      }

      // Update sidebar nav links
      document.querySelectorAll('.sidebar-nav .nav-link').forEach(link => {
        if (link.dataset.section === targetSectionId) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });

      // Page Title
      const titles = {
        'dashboard': 'Dashboard Overview',
        'holders': 'Policy Holder Management',
        'payment': 'Collect Premium Payment',
        'installments': 'Installment Schedules & Tracking',
        'due-dates': 'Due Date & Grace Period Management',
        'receipt': 'Official Premium Receipt',
        'history': 'Payment History & Audit Ledger',
        'reconciliation': 'Payment Reconciliation & Settlement',
        'reports': 'Financial MIS Statements & Reports'
      };

      if (pageTitle) {
        pageTitle.textContent = titles[targetSectionId] || 'Premium Collection System';
      }

      closeMobileSidebar();

      // Trigger section updates
      if (targetSectionId === 'dashboard') {
        updateDashboard();
      } else if (targetSectionId === 'holders') {
        renderHoldersTable();
      } else if (targetSectionId === 'payment') {
        populatePaymentHoldersDropdown();
      } else if (targetSectionId === 'installments') {
        renderInstallmentsTable();
      } else if (targetSectionId === 'due-dates') {
        renderDueDatesTable();
      } else if (targetSectionId === 'receipt') {
        renderReceiptView();
      } else if (targetSectionId === 'history') {
        renderHistoryTable();
      } else if (targetSectionId === 'reconciliation') {
        renderReconciliationTable();
      } else if (targetSectionId === 'reports') {
        generateSelectedReport();
      }

      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Attach click listeners
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        const sectionId = link.dataset.section || (href && href.startsWith('#') ? href.substring(1) : null);
        if (sectionId) {
          e.preventDefault();
          window.location.hash = sectionId;
          setActiveSection(sectionId);
        }
      });
    });

    window.addEventListener('hashchange', () => {
      setActiveSection(window.location.hash);
    });

    const initialHash = window.location.hash || '#dashboard';
    setActiveSection(initialHash);

    // Hero quick buttons
    document.getElementById('hero-quick-pay-btn')?.addEventListener('click', () => {
      window.location.hash = '#payment';
      setActiveSection('payment');
    });

    document.getElementById('hero-add-holder-btn')?.addEventListener('click', () => {
      openModal('modal-add-holder');
    });

    // Make Stat Cards Clickable
    document.querySelector('.stat-primary')?.addEventListener('click', () => {
      window.location.hash = '#history';
      setActiveSection('history');
    });
    document.querySelector('.stat-success')?.addEventListener('click', () => {
      window.location.hash = '#history';
      setActiveSection('history');
    });
    document.querySelector('.stat-warning')?.addEventListener('click', () => {
      window.location.hash = '#due-dates';
      setActiveSection('due-dates');
    });
    document.querySelector('.stat-danger')?.addEventListener('click', () => {
      window.location.hash = '#due-dates';
      setActiveSection('due-dates');
    });

    // Brand logo click navigates to dashboard
    document.querySelector('.sidebar-brand')?.addEventListener('click', (e) => {
      if (e.target.closest('#sidebar-close-btn')) return;
      window.location.hash = '#dashboard';
      setActiveSection('dashboard');
    });

    // Mobile sidebar listeners
    toggleBtn?.addEventListener('click', openMobileSidebar);
    closeBtn?.addEventListener('click', closeMobileSidebar);
    overlay?.addEventListener('click', closeMobileSidebar);
  }

  // Live Clock
  function initClock() {
    const clockEl = document.getElementById('system-time-display');
    function tick() {
      if (clockEl) {
        const now = new Date();
        clockEl.innerHTML = `<i class="fa-regular fa-clock"></i> ${now.toLocaleDateString('en-IN', {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        })} • ${now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}`;
      }
    }
    tick();
    setInterval(tick, 1000);
  }

  // Theme Toggle
  function initTheme() {
    const themeBtn = document.getElementById('theme-toggle-btn');
    document.body.setAttribute('data-theme', state.currentTheme);

    themeBtn?.addEventListener('click', () => {
      state.currentTheme = state.currentTheme === 'light' ? 'dark' : 'light';
      document.body.setAttribute('data-theme', state.currentTheme);
      safeStorage.setItem(STORAGE_KEYS.THEME, state.currentTheme);
      showToast('Theme Changed', `Switched to ${state.currentTheme} mode`, 'info');
      updateCharts();
    });
  }

  // Notifications
  function initNotifications() {
    const notifBtn = document.getElementById('notification-btn');
    const notifDropdown = document.getElementById('notification-dropdown');
    const notifList = document.getElementById('notification-list');
    const counter = document.getElementById('notification-counter');
    const clearBtn = document.getElementById('clear-notifications-btn');

    function renderNotifs() {
      if (!notifList) return;
      if (state.notifications.length === 0) {
        notifList.innerHTML = `<li class="notification-item text-center text-muted"><p>No new alerts</p></li>`;
        if (counter) counter.style.display = 'none';
        return;
      }

      if (counter) {
        counter.style.display = 'flex';
        counter.textContent = state.notifications.length;
      }

      notifList.innerHTML = state.notifications.map(n => `
        <li class="notification-item">
          <div class="notification-icon-wrap ${n.type}">
            <i class="fa-solid ${n.type === 'alert' ? 'fa-triangle-exclamation' : n.type === 'success' ? 'fa-check' : 'fa-bell'}"></i>
          </div>
          <div class="notification-content">
            <h5>${escapeHTML(n.title)}</h5>
            <p>${escapeHTML(n.text)}</p>
            <div class="time">${n.time}</div>
          </div>
        </li>
      `).join('');
    }

    notifBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      notifDropdown?.classList.toggle('hidden');
    });

    document.addEventListener('click', (e) => {
      if (!notifDropdown?.contains(e.target) && e.target !== notifBtn) {
        notifDropdown?.classList.add('hidden');
      }
    });

    clearBtn?.addEventListener('click', () => {
      state.notifications = [];
      persistAll();
      renderNotifs();
      showToast('Notifications Cleared', 'All alerts cleared', 'info');
    });

    renderNotifs();
  }

  // Quick Search
  function initQuickSearch() {
    const input = document.getElementById('global-search-input');
    const dropdown = document.getElementById('quick-search-dropdown');

    input?.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase().trim();
      if (!q) {
        dropdown.classList.add('hidden');
        return;
      }

      const matches = state.holders.filter(h => 
        h.name.toLowerCase().includes(q) ||
        h.policy_number.toLowerCase().includes(q) ||
        (h.phone && h.phone.includes(q))
      ).slice(0, 5);

      if (matches.length === 0) {
        dropdown.innerHTML = `<div class="quick-search-item"><span class="text-muted text-sm">No matching policies</span></div>`;
        dropdown.classList.remove('hidden');
        return;
      }

      dropdown.innerHTML = matches.map(m => `
        <div class="quick-search-item" data-holder-id="${m.id}">
          <div>
            <div class="item-title">${escapeHTML(m.name)}</div>
            <div class="item-sub">${escapeHTML(m.policy_number)} • Premium: ${formatINR(m.premium_amount)}</div>
          </div>
          <button class="btn btn-primary btn-sm btn-quick-select" data-holder-id="${m.id}">
            Pay
          </button>
        </div>
      `).join('');

      dropdown.classList.remove('hidden');

      dropdown.querySelectorAll('.quick-search-item').forEach(item => {
        item.addEventListener('click', () => {
          const hid = item.dataset.holderId;
          dropdown.classList.add('hidden');
          input.value = '';
          window.location.hash = '#payment';
          selectHolderInPaymentForm(hid);
        });
      });
    });

    document.addEventListener('click', (e) => {
      if (!dropdown?.contains(e.target) && e.target !== input) {
        dropdown?.classList.add('hidden');
      }
    });
  }

  // =========================================================================
  // 5. Dashboard Logic & Chart Handling (Canvas Fallback)
  // =========================================================================
  function updateDashboard() {
    const todayStr = new Date().toISOString().split('T')[0];
    const todaysPayments = state.payments.filter(p => p.paid_date === todayStr);
    const dailyTotal = todaysPayments.reduce((sum, p) => sum + (p.total_amount || p.amount || 0), 0);

    const dailyEl = document.getElementById('stat-daily-collections');
    const dailyCountEl = document.getElementById('stat-daily-count');
    if (dailyEl) dailyEl.textContent = formatINR(dailyTotal);
    if (dailyCountEl) dailyCountEl.textContent = todaysPayments.length;

    const currentYearMonth = todayStr.substring(0, 7);
    const monthlyPayments = state.payments.filter(p => (p.paid_date || '').startsWith(currentYearMonth));
    const monthlyTotal = monthlyPayments.reduce((sum, p) => sum + (p.total_amount || p.amount || 0), 0);
    const target = 350000;
    const targetPct = Math.min(100, Math.round((monthlyTotal / target) * 100));

    const monthlyEl = document.getElementById('stat-monthly-collections');
    const targetPctEl = document.getElementById('stat-target-pct');
    if (monthlyEl) monthlyEl.textContent = formatINR(monthlyTotal);
    if (targetPctEl) targetPctEl.textContent = `${targetPct}% of target`;

    let pendingCount = 0;
    let pendingTotal = 0;
    let overdueCount = 0;
    let overdueTotal = 0;

    state.holders.forEach(h => {
      const days = getDaysDifference(h.next_due_date);
      if (days < -30) {
        overdueCount++;
        overdueTotal += (h.premium_amount || 0);
      } else if (days <= 30) {
        pendingCount++;
        pendingTotal += (h.premium_amount || 0);
      }
    });

    const pendingAmtEl = document.getElementById('stat-pending-amount');
    const pendingCountEl = document.getElementById('stat-pending-count');
    if (pendingAmtEl) pendingAmtEl.textContent = formatINR(pendingTotal);
    if (pendingCountEl) pendingCountEl.textContent = pendingCount;

    const overdueAmtEl = document.getElementById('stat-overdue-amount');
    const overdueCountEl = document.getElementById('stat-overdue-count');
    if (overdueAmtEl) overdueAmtEl.textContent = formatINR(overdueTotal);
    if (overdueCountEl) overdueCountEl.textContent = overdueCount;

    const badgeHolders = document.getElementById('badge-holders-count');
    const badgeOverdue = document.getElementById('badge-overdue-count');
    if (badgeHolders) badgeHolders.textContent = state.holders.length;
    if (badgeOverdue) badgeOverdue.textContent = overdueCount;

    // User-Dependent Hero Title & Description
    const user = state.currentUser;
    const heroH2 = document.querySelector('.dashboard-hero .hero-text h2');
    const heroP = document.querySelector('.dashboard-hero .hero-text p');
    if (user && heroH2) {
      heroH2.textContent = `Welcome back, ${user.name}`;
    }
    if (user && heroP) {
      if (user.role === 'Admin') {
        heroP.innerHTML = `<span class="badge badge-warning">Branch Executive</span> Central Management & Settlement Console • Full clearance over counters & agent network`;
      } else if (user.role === 'Cashier') {
        heroP.innerHTML = `<span class="badge badge-success">Counter Terminal</span> ${user.deskId || 'Desk #01'} Active • Rapid premium intake, digital receipts & instant ledger clearance`;
      } else if (user.role === 'Agent') {
        heroP.innerHTML = `<span class="badge badge-info">Life Advisor</span> Advisor Code: <strong>${user.agentCode || 'AG-102'}</strong> • Portfolio servicing & client renewal follow-ups`;
      } else if (user.role === 'Policyholder') {
        heroP.innerHTML = `<span class="badge badge-primary">Insured Portal</span> Policy <code>${user.policyNo || 'LIC-12345'}</code> • Instant premium renewal, receipt downloads & Section 80C certs`;
      }
    }

    renderDashboardUrgentTable();
    renderDashboardRecentPayments();
    updateCharts();
  }

  function renderDashboardUrgentTable() {
    const tbody = document.getElementById('dashboard-urgent-dues-tbody');
    if (!tbody) return;

    const urgent = state.holders
      .map(h => ({ ...h, days: getDaysDifference(h.next_due_date) }))
      .filter(h => h.days <= 30)
      .sort((a, b) => a.days - b.days)
      .slice(0, 5);

    if (urgent.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" class="text-center text-muted">No urgent dues currently.</td></tr>`;
      return;
    }

    tbody.innerHTML = urgent.map(item => {
      let statusBadge = '';
      if (item.days < -30) {
        statusBadge = `<span class="badge badge-danger">Lapsed (${Math.abs(item.days)}d ago)</span>`;
      } else if (item.days < 0) {
        statusBadge = `<span class="badge badge-warning">Grace Period (${Math.abs(item.days)}d)</span>`;
      } else {
        statusBadge = `<span class="badge badge-info">Due in ${item.days}d</span>`;
      }

      return `
        <tr>
          <td><strong>${escapeHTML(item.name)}</strong></td>
          <td><code>${escapeHTML(item.policy_number)}</code></td>
          <td>${formatDate(item.next_due_date)}</td>
          <td><strong>${formatINR(item.premium_amount)}</strong></td>
          <td>${statusBadge}</td>
          <td>
            <button class="btn btn-primary btn-sm btn-pay-now" data-holder-id="${item.id}">
              <i class="fa-solid fa-credit-card"></i> Pay
            </button>
          </td>
        </tr>
      `;
    }).join('');

    tbody.querySelectorAll('.btn-pay-now').forEach(btn => {
      btn.addEventListener('click', () => {
        window.location.hash = '#payment';
        selectHolderInPaymentForm(btn.dataset.holderId);
      });
    });
  }

  function renderDashboardRecentPayments() {
    const tbody = document.getElementById('dashboard-recent-payments-tbody');
    if (!tbody) return;

    const recent = [...state.payments].reverse().slice(0, 5);

    if (recent.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" class="text-center text-muted">No recent transactions recorded.</td></tr>`;
      return;
    }

    tbody.innerHTML = recent.map(p => {
      const holder = state.holders.find(h => h.id === p.holder_id) || {};
      return `
        <tr>
          <td><code>${escapeHTML(p.receipt_no || '-')}</code></td>
          <td>${escapeHTML(holder.name || 'Unknown')}</td>
          <td><strong>${formatINR(p.total_amount || p.amount)}</strong></td>
          <td><span class="badge badge-neutral">${escapeHTML(p.payment_method)}</span></td>
          <td><span class="badge badge-success">Settled</span></td>
          <td>
            <button class="btn btn-outline btn-sm btn-view-rcpt" data-rcpt="${p.receipt_no}">
              <i class="fa-solid fa-receipt"></i>
            </button>
          </td>
        </tr>
      `;
    }).join('');

    tbody.querySelectorAll('.btn-view-rcpt').forEach(btn => {
      btn.addEventListener('click', () => {
        const rcptNo = btn.dataset.rcpt;
        const targetRcpt = state.receipts.find(r => r.receipt_no === rcptNo);
        if (targetRcpt) {
          state.activeReceiptId = targetRcpt.id;
          window.location.hash = '#receipt';
          renderReceiptView();
        }
      });
    });
  }

  // Canvas Native Rendering for Trends & Doughnut Chart
  function updateCharts() {
    const isDark = state.currentTheme === 'dark';
    const textColor = isDark ? '#94A3B8' : '#64748B';

    const canvasTrends = document.getElementById('chart-collection-trends');
    if (canvasTrends && canvasTrends.getContext) {
      const ctx = canvasTrends.getContext('2d');
      const w = canvasTrends.parentElement?.clientWidth || 500;
      const h = 260;
      canvasTrends.width = w;
      canvasTrends.height = h;

      ctx.clearRect(0, 0, w, h);

      const months = ['Jul', 'Aug', 'Sep', 'Oct (Curr)', 'Nov (Proj)', 'Dec (Proj)'];
      const values = [210, 280, 245, 310, 350, 420];
      const maxVal = 500;

      const paddingLeft = 45;
      const paddingBottom = 40;
      const chartW = w - paddingLeft - 20;
      const chartH = h - paddingBottom - 20;

      ctx.strokeStyle = isDark ? '#203539' : '#E2E8F0';
      ctx.lineWidth = 1;
      for (let i = 0; i <= 4; i++) {
        const y = 20 + (chartH / 4) * i;
        ctx.beginPath();
        ctx.moveTo(paddingLeft, y);
        ctx.lineTo(w - 20, y);
        ctx.stroke();

        ctx.fillStyle = textColor;
        ctx.font = '10px Plus Jakarta Sans, sans-serif';
        ctx.textAlign = 'right';
        ctx.fillText(`₹${Math.round(maxVal - (maxVal / 4) * i)}k`, paddingLeft - 6, y + 3);
      }

      const barWidth = Math.min(36, (chartW / months.length) - 16);
      const bottomY = 20 + chartH;

      months.forEach((m, i) => {
        const barH = (values[i] / maxVal) * chartH;
        const x = paddingLeft + (chartW / months.length) * i + ((chartW / months.length) - barWidth) / 2;
        const y = bottomY - barH;

        const grad = ctx.createLinearGradient(0, y, 0, bottomY);
        if (i === 3) {
          grad.addColorStop(0, '#059669');
          grad.addColorStop(1, '#047857');
        } else {
          grad.addColorStop(0, '#10B981');
          grad.addColorStop(1, '#34D399');
        }

        ctx.fillStyle = grad;
        ctx.beginPath();
        if (typeof ctx.roundRect === 'function') {
          ctx.roundRect(x, y, barWidth, barH, [4, 4, 0, 0]);
        } else {
          ctx.rect(x, y, barWidth, barH);
        }
        ctx.fill();

        ctx.fillStyle = textColor;
        ctx.textAlign = 'center';
        ctx.fillText(m, x + barWidth / 2, bottomY + 20);
        ctx.fillText(`₹${values[i]}k`, x + barWidth / 2, y - 6);
      });
    }

    const canvasMethods = document.getElementById('chart-payment-methods');
    if (canvasMethods && canvasMethods.getContext) {
      const ctx = canvasMethods.getContext('2d');
      const w = canvasMethods.parentElement?.clientWidth || 300;
      const h = 260;
      canvasMethods.width = w;
      canvasMethods.height = h;

      ctx.clearRect(0, 0, w, h);
      const centerX = w / 2;
      const centerY = h / 2 - 15;
      const radius = Math.min(centerX, centerY) - 20;

      const slices = [
        { label: 'UPI', val: 35, color: '#059669' },
        { label: 'Card', val: 25, color: '#3B82F6' },
        { label: 'Bank', val: 20, color: '#10B981' },
        { label: 'Cheque', val: 12, color: '#8B5CF6' },
        { label: 'Cash', val: 8, color: '#F59E0B' }
      ];

      let currentAngle = -0.5 * Math.PI;
      slices.forEach(s => {
        const sliceAngle = (s.val / 100) * 2 * Math.PI;
        ctx.fillStyle = s.color;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
        ctx.arc(centerX, centerY, radius * 0.65, currentAngle + sliceAngle, currentAngle, true);
        ctx.closePath();
        ctx.fill();
        currentAngle += sliceAngle;
      });

      ctx.fillStyle = textColor;
      ctx.font = '11px Plus Jakarta Sans, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Payment Channels', centerX, centerY + 3);
    }
  }

  // =========================================================================
  // 6. Pagination System for High-Volume Records (2,000+ Policies)
  // =========================================================================
  const tablePaginationState = {
    holders: { page: 1, pageSize: 25 },
    dueDates: { page: 1, pageSize: 25 },
    installments: { page: 1, pageSize: 25 }
  };

  function renderPaginationControls(containerId, infoId, totalItems, stateObj, onPageChange) {
    const nav = document.getElementById(containerId);
    const info = document.getElementById(infoId);
    if (!nav || !info) return;

    const pageSize = stateObj.pageSize === 'all' ? totalItems : parseInt(stateObj.pageSize, 10);
    const totalPages = (pageSize >= totalItems || pageSize <= 0) ? 1 : Math.ceil(totalItems / pageSize);
    if (stateObj.page > totalPages) stateObj.page = Math.max(1, totalPages);

    const startIdx = totalItems === 0 ? 0 : (stateObj.page - 1) * (stateObj.pageSize === 'all' ? totalItems : pageSize) + 1;
    const endIdx = stateObj.pageSize === 'all' ? totalItems : Math.min(stateObj.page * pageSize, totalItems);

    info.textContent = totalItems === 0 
      ? 'No records found'
      : `Showing ${startIdx.toLocaleString()}–${endIdx.toLocaleString()} of ${totalItems.toLocaleString()} records`;

    if (totalPages <= 1) {
      nav.innerHTML = '';
      return;
    }

    let buttonsHtml = '';
    buttonsHtml += `<button type="button" class="pagination-btn" data-page="${stateObj.page - 1}" ${stateObj.page === 1 ? 'disabled' : ''} title="Previous Page"><i class="fa-solid fa-chevron-left"></i></button>`;

    const cur = stateObj.page;
    const pagesToShow = [];
    pagesToShow.push(1);
    if (cur > 3) pagesToShow.push('...');
    for (let p = Math.max(2, cur - 1); p <= Math.min(totalPages - 1, cur + 1); p++) {
      pagesToShow.push(p);
    }
    if (cur < totalPages - 2) pagesToShow.push('...');
    if (totalPages > 1) pagesToShow.push(totalPages);

    pagesToShow.forEach(p => {
      if (p === '...') {
        buttonsHtml += `<span class="pagination-ellipsis">…</span>`;
      } else {
        buttonsHtml += `<button type="button" class="pagination-btn ${p === cur ? 'active' : ''}" data-page="${p}">${p}</button>`;
      }
    });

    buttonsHtml += `<button type="button" class="pagination-btn" data-page="${stateObj.page + 1}" ${stateObj.page === totalPages ? 'disabled' : ''} title="Next Page"><i class="fa-solid fa-chevron-right"></i></button>`;

    nav.innerHTML = buttonsHtml;

    nav.querySelectorAll('.pagination-btn:not([disabled])').forEach(btn => {
      btn.addEventListener('click', () => {
        const targetPage = parseInt(btn.dataset.page, 10);
        if (targetPage && targetPage >= 1 && targetPage <= totalPages) {
          stateObj.page = targetPage;
          onPageChange();
        }
      });
    });
  }

  // =========================================================================
  // 6. Policy Holder Management Module (User-Dependent Scoping)
  // =========================================================================
  function renderHoldersTable() {
    const tbody = document.getElementById('holders-table-tbody');
    const emptyState = document.getElementById('holders-empty-state');
    const noticeContainer = document.getElementById('holders-scope-notice-container');
    const searchVal = document.getElementById('holder-search-input')?.value.toLowerCase().trim() || '';
    const freqVal = document.getElementById('holder-filter-freq')?.value || '';
    const statusVal = document.getElementById('holder-filter-status')?.value || '';

    if (!tbody) return;

    const user = state.currentUser;
    let baseList = state.holders;

    // Scope notice & role-specific initial dataset
    if (noticeContainer) {
      if (user && user.role === 'Agent') {
        const agentCode = user.agentCode || 'AG-102';
        const agentName = user.name || 'R. K. Verma';
        const myClients = state.holders.filter(h => 
          h.agent_name && (h.agent_name.includes(agentCode) || h.agent_name.includes(agentName))
        );

        if (!userScopedFilters.holdersShowAll) {
          baseList = myClients;
          noticeContainer.innerHTML = `
            <div class="portfolio-filter-notice">
              <div>
                <i class="fa-solid fa-user-tag text-primary"></i> <strong>Agent Portfolio Scope:</strong> 
                Showing <strong>${myClients.length}</strong> client policies assigned to Advisor <strong>${escapeHTML(user.name)}</strong> (<code>${agentCode}</code>)
              </div>
              <button type="button" class="btn btn-outline btn-sm" id="btn-toggle-holders-scope">
                <i class="fa-solid fa-list"></i> View All Branch Policies (${state.holders.length})
              </button>
            </div>
          `;
        } else {
          noticeContainer.innerHTML = `
            <div class="portfolio-filter-notice">
              <div>
                <i class="fa-solid fa-globe text-muted"></i> <strong>All Branch Policies View:</strong> Showing all branch clients across all advisors.
              </div>
              <button type="button" class="btn btn-primary btn-sm" id="btn-toggle-holders-scope">
                <i class="fa-solid fa-filter"></i> Filter to My Clients (${myClients.length})
              </button>
            </div>
          `;
        }
      } else if (user && user.role === 'Policyholder') {
        const policyNo = user.policyNo || 'LIC-12345';
        const myRecord = state.holders.filter(h => 
          (user.policyNo && h.policy_number === user.policyNo) || 
          h.name.toLowerCase() === user.name.toLowerCase()
        );

        if (!userScopedFilters.holdersShowAll) {
          baseList = myRecord.length > 0 ? myRecord : state.holders.slice(0, 1);
          noticeContainer.innerHTML = `
            <div class="portfolio-filter-notice">
              <div>
                <i class="fa-solid fa-shield-halved text-success"></i> <strong>Insured Member Portal:</strong> 
                Showing registered policy for <strong>${escapeHTML(user.name)}</strong> (<code>${policyNo}</code>)
              </div>
              <button type="button" class="btn btn-outline btn-sm" id="btn-toggle-holders-scope">
                <i class="fa-solid fa-folder-open"></i> Browse Public Branch Directory
              </button>
            </div>
          `;
        } else {
          noticeContainer.innerHTML = `
            <div class="portfolio-filter-notice">
              <div>
                <i class="fa-solid fa-folder-open text-muted"></i> <strong>Public Directory View:</strong> Showing all branch policies.
              </div>
              <button type="button" class="btn btn-primary btn-sm" id="btn-toggle-holders-scope">
                <i class="fa-solid fa-user-shield"></i> Focus on My Policy
              </button>
            </div>
          `;
        }
      } else {
        noticeContainer.innerHTML = '';
      }

      document.getElementById('btn-toggle-holders-scope')?.addEventListener('click', () => {
        userScopedFilters.holdersShowAll = !userScopedFilters.holdersShowAll;
        renderHoldersTable();
      });
    }

    let filtered = baseList.filter(h => {
      const matchSearch = !searchVal ||
        h.name.toLowerCase().includes(searchVal) ||
        h.policy_number.toLowerCase().includes(searchVal) ||
        (h.phone && h.phone.toLowerCase().includes(searchVal));

      const matchFreq = !freqVal || h.payment_frequency === freqVal;

      let status = 'Active';
      const days = getDaysDifference(h.next_due_date);
      if (days < -30) status = 'Overdue';
      else if (days < 0) status = 'Grace Period';

      const matchStatus = !statusVal || status === statusVal;

      return matchSearch && matchFreq && matchStatus;
    });

    if (filtered.length === 0) {
      tbody.innerHTML = '';
      emptyState?.classList.remove('hidden');
      document.getElementById('holders-pagination-bar')?.classList.add('hidden');
      return;
    }

    emptyState?.classList.add('hidden');
    document.getElementById('holders-pagination-bar')?.classList.remove('hidden');

    const pSize = tablePaginationState.holders.pageSize === 'all' ? filtered.length : parseInt(tablePaginationState.holders.pageSize, 10);
    const totalPages = Math.ceil(filtered.length / pSize) || 1;
    if (tablePaginationState.holders.page > totalPages) tablePaginationState.holders.page = 1;
    const start = (tablePaginationState.holders.page - 1) * pSize;
    const pageItems = tablePaginationState.holders.pageSize === 'all' ? filtered : filtered.slice(start, start + pSize);

    tbody.innerHTML = pageItems.map(h => {
      const days = getDaysDifference(h.next_due_date);
      let statusBadge = '<span class="badge badge-success">Active</span>';
      if (days < -30) {
        statusBadge = '<span class="badge badge-danger">Lapsed / Overdue</span>';
      } else if (days < 0) {
        statusBadge = '<span class="badge badge-warning">Grace Period</span>';
      }

      const isMyPolicy = user && user.role === 'Policyholder' && (h.policy_number === user.policyNo || h.name.toLowerCase() === user.name.toLowerCase());

      return `
        <tr class="${isMyPolicy ? 'highlight-row' : ''}">
          <td>
            <strong>${escapeHTML(h.name)}</strong>
            ${isMyPolicy ? '<span class="badge badge-primary ml-1">My Policy</span>' : ''}
            <div class="text-xs text-muted">Nominee: ${escapeHTML(h.nominee || 'Self')}</div>
          </td>
          <td>
            <code>${escapeHTML(h.policy_number)}</code>
            <div class="text-xs text-muted">${escapeHTML(h.plan_name || 'Endowment Plan')}</div>
          </td>
          <td><strong>${formatINR(h.premium_amount)}</strong></td>
          <td><span class="badge badge-neutral">${escapeHTML(h.payment_frequency)}</span></td>
          <td>
            <span>${formatDate(h.next_due_date)}</span>
            <div class="text-xs ${days < 0 ? 'text-danger' : 'text-muted'}">
              ${days < 0 ? `${Math.abs(days)}d past due` : `in ${days} days`}
            </div>
          </td>
          <td>${statusBadge}</td>
          <td>
            <div class="text-xs">
              <i class="fa-solid fa-phone"></i> ${escapeHTML(h.phone || '-')}<br>
              <i class="fa-regular fa-envelope"></i> ${escapeHTML(h.email || '-')}
            </div>
          </td>
          <td class="text-right">
            <div class="table-action-btns">
              <button class="btn btn-primary btn-sm btn-holder-pay" data-id="${h.id}" title="Collect Payment">
                <i class="fa-solid fa-receipt"></i> Pay
              </button>
              ${user.role !== 'Policyholder' ? `
              <button class="btn btn-outline btn-sm btn-holder-edit" data-id="${h.id}" title="Edit Holder">
                <i class="fa-solid fa-pen-to-square"></i>
              </button>
              <button class="btn btn-outline btn-sm btn-holder-delete text-danger" data-id="${h.id}" title="Delete">
                <i class="fa-solid fa-trash"></i>
              </button>
              ` : `
              <button class="btn btn-outline btn-sm btn-holder-view" data-id="${h.id}" title="View Details">
                <i class="fa-solid fa-eye"></i> Details
              </button>
              `}
            </div>
          </td>
        </tr>
      `;
    }).join('');

    tbody.querySelectorAll('.btn-holder-pay').forEach(btn => {
      btn.addEventListener('click', () => {
        window.location.hash = '#payment';
        selectHolderInPaymentForm(btn.dataset.id);
      });
    });

    tbody.querySelectorAll('.btn-holder-edit').forEach(btn => {
      btn.addEventListener('click', () => {
        openEditHolderModal(btn.dataset.id);
      });
    });

    tbody.querySelectorAll('.btn-holder-delete').forEach(btn => {
      btn.addEventListener('click', () => {
        deletePolicyHolder(btn.dataset.id);
      });
    });

    tbody.querySelectorAll('.btn-holder-view').forEach(btn => {
      btn.addEventListener('click', () => {
        openEditHolderModal(btn.dataset.id);
      });
    });

    renderPaginationControls('holders-pagination-nav', 'holders-pagination-info', filtered.length, tablePaginationState.holders, renderHoldersTable);
  }

  function initHolderFilters() {
    document.getElementById('holder-search-input')?.addEventListener('input', () => {
      tablePaginationState.holders.page = 1;
      renderHoldersTable();
    });
    document.getElementById('holder-filter-freq')?.addEventListener('change', () => {
      tablePaginationState.holders.page = 1;
      renderHoldersTable();
    });
    document.getElementById('holder-filter-status')?.addEventListener('change', () => {
      tablePaginationState.holders.page = 1;
      renderHoldersTable();
    });
    document.getElementById('holders-page-size')?.addEventListener('change', (e) => {
      tablePaginationState.holders.pageSize = e.target.value;
      tablePaginationState.holders.page = 1;
      renderHoldersTable();
    });
    document.getElementById('btn-reset-holder-filters')?.addEventListener('click', () => {
      const s = document.getElementById('holder-search-input');
      const f = document.getElementById('holder-filter-freq');
      const st = document.getElementById('holder-filter-status');
      if (s) s.value = '';
      if (f) f.value = '';
      if (st) st.value = '';
      tablePaginationState.holders.page = 1;
      userScopedFilters.holdersShowAll = false;
      renderHoldersTable();
    });

    document.getElementById('btn-open-add-holder-modal')?.addEventListener('click', () => {
      document.getElementById('form-add-holder').reset();
      document.getElementById('holder-edit-id').value = '';
      document.getElementById('modal-holder-title').innerHTML = '<i class="fa-solid fa-user-plus"></i> Add New Policy Holder';
      openModal('modal-add-holder');
    });

    document.getElementById('form-add-holder')?.addEventListener('submit', (e) => {
      e.preventDefault();
      savePolicyHolder();
    });

    document.getElementById('btn-export-holders-csv')?.addEventListener('click', exportHoldersToCSV);
  }

  function openEditHolderModal(id) {
    const holder = state.holders.find(h => h.id === parseInt(id, 10));
    if (!holder) return;

    document.getElementById('holder-edit-id').value = holder.id;
    document.getElementById('new-holder-name').value = holder.name;
    document.getElementById('new-holder-policy').value = holder.policy_number;
    document.getElementById('new-holder-plan').value = holder.plan_name;
    document.getElementById('new-holder-sum-assured').value = holder.sum_assured;
    document.getElementById('new-holder-amount').value = holder.premium_amount;
    document.getElementById('new-holder-freq').value = holder.payment_frequency;
    document.getElementById('new-holder-due-date').value = holder.next_due_date;
    document.getElementById('new-holder-phone').value = holder.phone || '';
    document.getElementById('new-holder-email').value = holder.email || '';
    document.getElementById('new-holder-nominee').value = holder.nominee || '';

    document.getElementById('modal-holder-title').innerHTML = '<i class="fa-solid fa-user-pen"></i> Edit Policy Holder';
    openModal('modal-add-holder');
  }

  function savePolicyHolder() {
    const editId = document.getElementById('holder-edit-id').value;
    const name = document.getElementById('new-holder-name').value.trim();
    const policy = document.getElementById('new-holder-policy').value.trim();
    const plan = document.getElementById('new-holder-plan').value.trim();
    const sumAssured = parseFloat(document.getElementById('new-holder-sum-assured').value) || 0;
    const amount = parseFloat(document.getElementById('new-holder-amount').value) || 0;
    const freq = document.getElementById('new-holder-freq').value;
    const dueDate = document.getElementById('new-holder-due-date').value;
    const phone = document.getElementById('new-holder-phone').value.trim();
    const email = document.getElementById('new-holder-email').value.trim();
    const nominee = document.getElementById('new-holder-nominee').value.trim();

    if (!name || !policy || !dueDate || amount <= 0) {
      showToast('Validation Error', 'Please complete all required fields.', 'error');
      return;
    }

    if (editId) {
      const idx = state.holders.findIndex(h => h.id === parseInt(editId, 10));
      if (idx !== -1) {
        state.holders[idx] = {
          ...state.holders[idx],
          name, policy_number: policy, plan_name: plan,
          sum_assured: sumAssured, premium_amount: amount,
          payment_frequency: freq, next_due_date: dueDate,
          phone, email, nominee
        };
        showToast('Updated', `Policy holder ${name} updated successfully!`, 'success');
      }
    } else {
      const newId = (state.holders.reduce((max, h) => Math.max(max, h.id), 0) || 0) + 1;
      const newHolder = {
        id: newId,
        name,
        policy_number: policy,
        plan_name: plan,
        sum_assured: sumAssured,
        premium_amount: amount,
        payment_frequency: freq,
        next_due_date: dueDate,
        phone,
        email,
        nominee,
        agent_name: `${state.currentUser.name} (${state.currentUser.agentCode || state.currentUser.deskId || 'Counter'})`
      };

      state.holders.push(newHolder);

      const newInstId = (state.installments.reduce((max, i) => Math.max(max, i.id), 0) || 0) + 1;
      state.installments.push({
        id: newInstId,
        holder_id: newId,
        installment_no: 1,
        total_installments: freq === 'Yearly' ? 20 : freq === 'Half-Yearly' ? 40 : 80,
        amount,
        due_date: dueDate,
        status: "Pending"
      });

      showToast('Holder Added', `New policy holder ${name} created with policy ${policy}`, 'success');
    }

    persistAll();
    closeModal('modal-add-holder');
    renderHoldersTable();
    updateDashboard();
    populatePaymentHoldersDropdown();
  }

  function deletePolicyHolder(id) {
    const holder = state.holders.find(h => h.id === parseInt(id, 10));
    if (!holder) return;

    if (confirm(`Are you sure you want to delete policy holder "${holder.name}" (${holder.policy_number})?`)) {
      state.holders = state.holders.filter(h => h.id !== parseInt(id, 10));
      persistAll();
      showToast('Deleted', `Policy holder removed from system.`, 'info');
      renderHoldersTable();
      updateDashboard();
      populatePaymentHoldersDropdown();
    }
  }

  function exportHoldersToCSV() {
    const headers = ["ID", "Name", "Policy Number", "Plan Name", "Sum Assured", "Premium Amount", "Frequency", "Next Due Date", "Phone", "Email", "Nominee", "Agent"];
    const rows = state.holders.map(h => [
      h.id,
      `"${h.name}"`,
      `"${h.policy_number}"`,
      `"${h.plan_name}"`,
      h.sum_assured,
      h.premium_amount,
      h.payment_frequency,
      h.next_due_date,
      `"${h.phone}"`,
      `"${h.email}"`,
      `"${h.nominee}"`,
      `"${h.agent_name || '-'}"`
    ]);

    downloadCSV("Policy_Holders_Export.csv", [headers, ...rows]);
    showToast('Export Complete', 'Downloaded policy holders CSV', 'success');
  }

  // =========================================================================
  // 7. Premium Payment Collection Counter
  // =========================================================================
  function populatePaymentHoldersDropdown(query = '') {
    const select = document.getElementById('pay-holder-select');
    const chipsContainer = document.getElementById('quick-autofill-chips');
    const submitBtn = document.getElementById('btn-submit-payment');
    if (!select) return;

    const user = state.currentUser;
    let list = state.holders;

    if (query) {
      const q = query.toLowerCase().trim();
      list = state.holders.filter(h =>
        h.name.toLowerCase().includes(q) ||
        h.policy_number.toLowerCase().includes(q) ||
        (h.phone && h.phone.includes(q))
      );
    }

    const displayList = list.slice(0, 100);
    const placeholder = query
      ? `-- Found ${list.length.toLocaleString()} matching policies (showing top 100) --`
      : `-- Choose Policy Holder (${state.holders.length.toLocaleString()} total, or search above) --`;

    select.innerHTML = `<option value="">${placeholder}</option>` +
      displayList.map(h => `
        <option value="${h.id}">${escapeHTML(h.name)} (${escapeHTML(h.policy_number)}) - Due: ${formatDate(h.next_due_date)} [₹${h.premium_amount.toLocaleString()}]</option>
      `).join('');

    if (query && list.length === 1) {
      select.value = list[0].id;
      triggerHolderSelectionChange(list[0].id);
    }

    let relevantHolders = state.holders;

    if (user && user.role === 'Policyholder') {
      const myHolder = state.holders.find(h => 
        (user.policyNo && h.policy_number === user.policyNo) || 
        h.name.toLowerCase() === user.name.toLowerCase()
      ) || state.holders[0];

      if (myHolder) {
        select.value = myHolder.id;
        triggerHolderSelectionChange(myHolder.id);
        relevantHolders = [myHolder];
      }

      if (submitBtn) {
        submitBtn.innerHTML = '<i class="fa-solid fa-lock"></i> Pay My Premium (Secure Checkout)';
      }
    } else if (user && user.role === 'Agent') {
      const agentCode = user.agentCode || 'AG-102';
      const myClients = state.holders.filter(h => 
        h.agent_name && (h.agent_name.includes(agentCode) || h.agent_name.includes(user.name))
      );
      if (myClients.length > 0) relevantHolders = myClients;

      if (submitBtn) {
        submitBtn.innerHTML = `<i class="fa-solid fa-handshake"></i> Collect Client Renewal (${escapeHTML(user.name)})`;
      }
    } else {
      if (submitBtn) {
        submitBtn.innerHTML = '<i class="fa-solid fa-circle-check"></i> Process Payment & Issue Receipt';
      }
    }

    if (chipsContainer) {
      chipsContainer.innerHTML = relevantHolders.slice(0, 4).map(h => `
        <button type="button" class="autofill-chip-btn ${user && user.role === 'Policyholder' ? 'active' : ''}" data-id="${h.id}">
          <div>
            <strong>${user && user.role === 'Policyholder' ? '★ Your Policy: ' : ''}${escapeHTML(h.name)}</strong>
            <span>${escapeHTML(h.policy_number)} • Due: ${formatDate(h.next_due_date)}</span>
          </div>
          <span class="badge badge-success">${formatINR(h.premium_amount)}</span>
        </button>
      `).join('');

      chipsContainer.querySelectorAll('.autofill-chip-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          selectHolderInPaymentForm(btn.dataset.id);
        });
      });
    }
  }

  function selectHolderInPaymentForm(holderId) {
    const select = document.getElementById('pay-holder-select');
    if (!select) return;

    select.value = holderId;
    triggerHolderSelectionChange(holderId);
  }

  function triggerHolderSelectionChange(holderId) {
    const summaryBox = document.getElementById('payment-holder-summary');
    const amountInput = document.getElementById('pay-amount-input');
    const lateFeeInput = document.getElementById('pay-late-fee-input');
    const lateFeeHint = document.getElementById('pay-late-fee-hint');

    if (!holderId) {
      summaryBox?.classList.add('hidden');
      if (amountInput) amountInput.value = '';
      if (lateFeeInput) lateFeeInput.value = '0';
      recalculateNetPayable();
      return;
    }

    const holder = state.holders.find(h => h.id === parseInt(holderId, 10));
    if (!holder) return;

    summaryBox?.classList.remove('hidden');
    document.getElementById('pay-summary-policy-no').textContent = holder.policy_number;
    document.getElementById('pay-summary-plan').textContent = `${holder.plan_name} (Sum: ${formatINR(holder.sum_assured)})`;
    document.getElementById('pay-summary-freq').textContent = holder.payment_frequency;
    document.getElementById('pay-summary-due-date').textContent = formatDate(holder.next_due_date);
    document.getElementById('pay-summary-nominee').textContent = holder.nominee || 'Self';

    const days = getDaysDifference(holder.next_due_date);
    const badge = document.getElementById('pay-summary-grace-badge');

    let lateFee = 0;
    if (days < -30) {
      lateFee = Math.round(holder.premium_amount * 0.015);
      if (badge) {
        badge.className = 'badge badge-danger';
        badge.textContent = `Lapsed (${Math.abs(days)} days overdue) • Late Fee Applicable`;
      }
      if (lateFeeHint) lateFeeHint.textContent = `Overdue past 30 days grace window (+1.5% interest assessed)`;
    } else if (days < 0) {
      if (badge) {
        badge.className = 'badge badge-warning';
        badge.textContent = `Grace Period Active (${30 - Math.abs(days)} days grace remaining) • 0 Late Fee`;
      }
      if (lateFeeHint) lateFeeHint.textContent = `Cover active in grace window. No penalty charged.`;
    } else {
      if (badge) {
        badge.className = 'badge badge-success';
        badge.textContent = `Regular Advance Payment (${days} days till due)`;
      }
      if (lateFeeHint) lateFeeHint.textContent = `On-time collection.`;
    }

    if (amountInput) amountInput.value = holder.premium_amount;
    if (lateFeeInput) lateFeeInput.value = lateFee;

    recalculateNetPayable();
  }

  function recalculateNetPayable() {
    const amount = parseFloat(document.getElementById('pay-amount-input')?.value) || 0;
    const lateFee = parseFloat(document.getElementById('pay-late-fee-input')?.value) || 0;
    const total = amount + lateFee;

    const display = document.getElementById('pay-total-payable-display');
    if (display) display.textContent = formatINR(total);
  }

  function initPaymentForm() {
    const select = document.getElementById('pay-holder-select');
    select?.addEventListener('change', (e) => {
      triggerHolderSelectionChange(e.target.value);
    });

    document.getElementById('pay-holder-search')?.addEventListener('input', (e) => {
      populatePaymentHoldersDropdown(e.target.value);
    });

    document.getElementById('pay-amount-input')?.addEventListener('input', recalculateNetPayable);
    document.getElementById('pay-late-fee-input')?.addEventListener('input', recalculateNetPayable);

    const channelCards = document.querySelectorAll('.payment-channel-card');
    channelCards.forEach(card => {
      card.addEventListener('click', () => {
        channelCards.forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        const radio = card.querySelector('input[type="radio"]');
        if (radio) radio.checked = true;
        updateMethodSubfields(radio.value);
      });
    });

    function updateMethodSubfields(method) {
      const upi = document.getElementById('method-fields-upi');
      const cheque = document.getElementById('method-fields-cheque');
      const card = document.getElementById('method-fields-card');
      const generic = document.getElementById('method-fields-generic');

      upi?.classList.add('hidden');
      cheque?.classList.add('hidden');
      card?.classList.add('hidden');
      generic?.classList.add('hidden');

      if (method === 'UPI') upi?.classList.remove('hidden');
      else if (method === 'Cheque') cheque?.classList.remove('hidden');
      else if (method === 'Credit Card') card?.classList.remove('hidden');
      else generic?.classList.remove('hidden');
    }

    document.getElementById('premium-collection-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      processPremiumPayment();
    });

    document.getElementById('btn-clear-payment-form')?.addEventListener('click', () => {
      document.getElementById('premium-collection-form').reset();
      document.getElementById('payment-holder-summary').classList.add('hidden');
      document.getElementById('pay-total-payable-display').textContent = '₹0';
      showToast('Form Cleared', 'Payment form reset', 'info');
    });
  }

  function processPremiumPayment() {
    const holderId = parseInt(document.getElementById('pay-holder-select').value, 10);
    const amount = parseFloat(document.getElementById('pay-amount-input').value) || 0;
    const lateFee = parseFloat(document.getElementById('pay-late-fee-input').value) || 0;
    const totalAmount = amount + lateFee;
    const method = document.querySelector('input[name="payment_method"]:checked')?.value || 'UPI';
    const notes = document.getElementById('pay-notes-input')?.value.trim() || '';

    if (!holderId || amount <= 0) {
      showToast('Validation Error', 'Please select a policy holder and enter a valid amount.', 'error');
      return;
    }

    const holder = state.holders.find(h => h.id === holderId);
    if (!holder) return;

    let referenceNo = '';
    if (method === 'UPI') {
      referenceNo = document.getElementById('pay-upi-ref')?.value.trim() || `UPI-${Date.now().toString().slice(-9)}`;
    } else if (method === 'Cheque') {
      const chq = document.getElementById('pay-cheque-no')?.value.trim() || `CHQ-${Math.floor(100000 + Math.random() * 900000)}`;
      const bank = document.getElementById('pay-cheque-bank')?.value.trim() || 'Bank';
      referenceNo = `${chq} (${bank})`;
    } else if (method === 'Credit Card') {
      const auth = document.getElementById('pay-card-auth')?.value.trim() || `AUTH-${Math.floor(1000 + Math.random() * 9000)}`;
      referenceNo = `POS-CARD-${auth}`;
    } else {
      referenceNo = document.getElementById('pay-generic-ref')?.value.trim() || `TXN-${Date.now().toString().slice(-8)}`;
    }

    const nextRcptNum = state.receipts.length + 1;
    const receiptNo = `RCP-2026-${String(nextRcptNum).padStart(3, '0')}`;
    const todayStr = new Date().toISOString().split('T')[0];
    const timeStr = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

    const paymentId = (state.payments.reduce((max, p) => Math.max(max, p.id), 0) || 0) + 1;
    const collectorString = `${state.currentUser.name} (${state.currentUser.role}${state.currentUser.deskId ? ' • ' + state.currentUser.deskId : state.currentUser.agentCode ? ' • ' + state.currentUser.agentCode : ' • Online Portal'})`;

    const paymentRecord = {
      id: paymentId,
      holder_id: holder.id,
      amount,
      late_fee: lateFee,
      total_amount: totalAmount,
      due_date: holder.next_due_date,
      paid_date: todayStr,
      status: "Paid",
      payment_method: method,
      reference_no: referenceNo,
      receipt_no: receiptNo,
      collector: collectorString,
      notes: notes || `Premium deposit via ${method} (${state.currentUser.role} Entry)`
    };
    state.payments.push(paymentRecord);

    const receiptRecord = {
      id: nextRcptNum,
      payment_id: paymentId,
      receipt_no: receiptNo,
      date: todayStr,
      time: timeStr,
      holder_id: holder.id,
      holder_name: holder.name,
      policy_no: holder.policy_number,
      plan_name: holder.plan_name,
      amount: amount,
      late_fee: lateFee,
      total_amount: totalAmount,
      payment_method: method,
      reference_no: referenceNo,
      collector: collectorString,
      period_desc: `${holder.payment_frequency} Installment (${new Date().getFullYear()})`
    };
    state.receipts.push(receiptRecord);
    state.activeReceiptId = nextRcptNum;

    // Advance Next Due Date
    const curDue = new Date(holder.next_due_date);
    if (holder.payment_frequency === 'Yearly') {
      curDue.setFullYear(curDue.getFullYear() + 1);
    } else if (holder.payment_frequency === 'Half-Yearly') {
      curDue.setMonth(curDue.getMonth() + 6);
    } else if (holder.payment_frequency === 'Quarterly') {
      curDue.setMonth(curDue.getMonth() + 3);
    } else if (holder.payment_frequency === 'Monthly') {
      curDue.setMonth(curDue.getMonth() + 1);
    }
    holder.next_due_date = curDue.toISOString().split('T')[0];

    const pendingInst = state.installments.find(i => i.holder_id === holder.id && i.status !== 'Paid');
    if (pendingInst) {
      pendingInst.status = 'Paid';
    }

    const reconEntry = state.reconciliation.find(r => r.date === todayStr && r.channel.toLowerCase().includes(method.toLowerCase()));
    if (reconEntry) {
      reconEntry.expected += totalAmount;
      reconEntry.actual += totalAmount;
    } else {
      state.reconciliation.unshift({
        id: (state.reconciliation.reduce((max, r) => Math.max(max, r.id), 0) || 0) + 1,
        date: todayStr,
        channel: `${method} Collections`,
        expected: totalAmount,
        actual: totalAmount,
        variance: 0,
        status: "Reconciled",
        reconciled_by: `${state.currentUser.name} (${state.currentUser.role})`,
        notes: `Immediate counter credit settlement`
      });
    }

    state.notifications.unshift({
      id: Date.now(),
      title: "Payment Collected",
      text: `${formatINR(totalAmount)} collected for ${holder.name} (${holder.policy_number}).`,
      time: "Just now",
      type: "success"
    });

    persistAll();

    document.getElementById('success-modal-rcpt-no').textContent = receiptNo;
    document.getElementById('success-modal-amount').textContent = formatINR(totalAmount);
    document.getElementById('success-modal-method').textContent = `${method} (Ref: ${referenceNo})`;
    openModal('modal-payment-success');

    document.getElementById('premium-collection-form').reset();
    document.getElementById('payment-holder-summary').classList.add('hidden');
    document.getElementById('pay-total-payable-display').textContent = '₹0';

    showToast('Payment Successful', `Receipt #${receiptNo} generated for ${holder.name}`, 'success');

    document.getElementById('btn-success-view-receipt').onclick = () => {
      closeModal('modal-payment-success');
      window.location.hash = '#receipt';
      renderReceiptView();
    };
  }

  // =========================================================================
  // 8. Installment Tracking Module (User-Dependent Scoping)
  // =========================================================================
  function renderInstallmentsTable() {
    const tbody = document.getElementById('installments-table-tbody');
    const noticeContainer = document.getElementById('installments-scope-notice-container');
    const searchVal = document.getElementById('inst-search-input')?.value.toLowerCase().trim() || '';
    const statusVal = document.getElementById('inst-status-filter')?.value || '';

    if (!tbody) return;

    const user = state.currentUser;
    let baseList = state.installments;

    if (noticeContainer) {
      if (user && user.role === 'Policyholder') {
        const myHolder = state.holders.find(h => 
          (user.policyNo && h.policy_number === user.policyNo) || 
          h.name.toLowerCase() === user.name.toLowerCase()
        );
        const myHolderId = myHolder ? myHolder.id : 1;
        const myInsts = state.installments.filter(i => i.holder_id === myHolderId);

        if (!userScopedFilters.installmentsShowAll) {
          baseList = myInsts;
          noticeContainer.innerHTML = `
            <div class="portfolio-filter-notice">
              <div>
                <i class="fa-solid fa-calendar-check text-success"></i> <strong>Personal Installment Schedule:</strong> 
                Showing policy repayment milestones for <strong>${escapeHTML(user.name)}</strong> (<code>${user.policyNo || 'LIC-12345'}</code>)
              </div>
              <button type="button" class="btn btn-outline btn-sm" id="btn-toggle-inst-scope">
                <i class="fa-solid fa-list"></i> View All Branch Installments (${state.installments.length})
              </button>
            </div>
          `;
        } else {
          noticeContainer.innerHTML = `
            <div class="portfolio-filter-notice">
              <div>
                <i class="fa-solid fa-list text-muted"></i> <strong>All Branch Installments:</strong> Showing entire branch portfolio.
              </div>
              <button type="button" class="btn btn-primary btn-sm" id="btn-toggle-inst-scope">
                <i class="fa-solid fa-user-shield"></i> Focus on My Schedule (${myInsts.length})
              </button>
            </div>
          `;
        }
      } else if (user && user.role === 'Agent') {
        const agentCode = user.agentCode || 'AG-102';
        const myClientIds = state.holders
          .filter(h => h.agent_name && (h.agent_name.includes(agentCode) || h.agent_name.includes(user.name)))
          .map(h => h.id);
        const myInsts = state.installments.filter(i => myClientIds.includes(i.holder_id));

        if (!userScopedFilters.installmentsShowAll) {
          baseList = myInsts;
          noticeContainer.innerHTML = `
            <div class="portfolio-filter-notice">
              <div>
                <i class="fa-solid fa-user-tag text-primary"></i> <strong>Advisor Portfolio Schedules:</strong> 
                Showing installments for clients assigned to <strong>${escapeHTML(user.name)}</strong> (<code>${agentCode}</code>)
              </div>
              <button type="button" class="btn btn-outline btn-sm" id="btn-toggle-inst-scope">
                <i class="fa-solid fa-list"></i> View All Branch Installments (${state.installments.length})
              </button>
            </div>
          `;
        } else {
          noticeContainer.innerHTML = `
            <div class="portfolio-filter-notice">
              <div>
                <i class="fa-solid fa-globe text-muted"></i> <strong>All Branch Installments View:</strong> Showing all branch schedules.
              </div>
              <button type="button" class="btn btn-primary btn-sm" id="btn-toggle-inst-scope">
                <i class="fa-solid fa-filter"></i> Filter to My Portfolio (${myInsts.length})
              </button>
            </div>
          `;
        }
      } else {
        noticeContainer.innerHTML = '';
      }

      document.getElementById('btn-toggle-inst-scope')?.addEventListener('click', () => {
        userScopedFilters.installmentsShowAll = !userScopedFilters.installmentsShowAll;
        renderInstallmentsTable();
      });
    }

    const totalInst = baseList.length;
    const paidInst = baseList.filter(i => i.status === 'Paid').length;
    const pendingInst = baseList.filter(i => i.status === 'Pending').length;
    const overdueInst = baseList.filter(i => i.status === 'Overdue').length;

    document.getElementById('inst-stat-total').textContent = totalInst;
    document.getElementById('inst-stat-paid').textContent = paidInst;
    document.getElementById('inst-stat-pending').textContent = pendingInst;
    document.getElementById('inst-stat-overdue').textContent = overdueInst;

    let filtered = baseList.filter(inst => {
      const holder = state.holders.find(h => h.id === inst.holder_id) || {};
      const matchSearch = !searchVal ||
        (holder.name && holder.name.toLowerCase().includes(searchVal)) ||
        (holder.policy_number && holder.policy_number.toLowerCase().includes(searchVal));

      const matchStatus = !statusVal || inst.status === statusVal;
      return matchSearch && matchStatus;
    });

    if (filtered.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" class="text-center text-muted">No installments matching filter.</td></tr>`;
      document.getElementById('installments-pagination-bar')?.classList.add('hidden');
      return;
    }

    document.getElementById('installments-pagination-bar')?.classList.remove('hidden');

    const pSize = tablePaginationState.installments.pageSize === 'all' ? filtered.length : parseInt(tablePaginationState.installments.pageSize, 10);
    const totalPages = Math.ceil(filtered.length / pSize) || 1;
    if (tablePaginationState.installments.page > totalPages) tablePaginationState.installments.page = 1;
    const start = (tablePaginationState.installments.page - 1) * pSize;
    const pageItems = tablePaginationState.installments.pageSize === 'all' ? filtered : filtered.slice(start, start + pSize);

    tbody.innerHTML = pageItems.map(inst => {
      const holder = state.holders.find(h => h.id === inst.holder_id) || { name: 'Unknown', policy_number: '-' };
      let badge = '<span class="badge badge-warning">Pending</span>';
      if (inst.status === 'Paid') badge = '<span class="badge badge-success">Paid</span>';
      else if (inst.status === 'Overdue') badge = '<span class="badge badge-danger">Overdue</span>';

      return `
        <tr>
          <td><strong>#${inst.installment_no}</strong> of ${inst.total_installments}</td>
          <td>${escapeHTML(holder.name)}</td>
          <td><code>${escapeHTML(holder.policy_number)}</code></td>
          <td>${formatDate(inst.due_date)}</td>
          <td><strong>${formatINR(inst.amount)}</strong></td>
          <td>${badge}</td>
          <td>
            ${inst.status === 'Paid'
              ? '<span class="text-xs text-muted"><i class="fa-solid fa-check"></i> Settled</span>'
              : `<button class="btn btn-primary btn-sm btn-collect-inst" data-holder-id="${holder.id}">
                  <i class="fa-solid fa-credit-card"></i> ${user && user.role === 'Policyholder' ? 'Pay Online' : 'Collect Now'}
                 </button>`
            }
          </td>
        </tr>
      `;
    }).join('');

    tbody.querySelectorAll('.btn-collect-inst').forEach(btn => {
      btn.addEventListener('click', () => {
        window.location.hash = '#payment';
        selectHolderInPaymentForm(btn.dataset.holderId);
      });
    });

    renderPaginationControls('installments-pagination-nav', 'installments-pagination-info', filtered.length, tablePaginationState.installments, renderInstallmentsTable);
  }

  function initInstallmentFilters() {
    document.getElementById('inst-search-input')?.addEventListener('input', () => {
      tablePaginationState.installments.page = 1;
      renderInstallmentsTable();
    });
    document.getElementById('inst-status-filter')?.addEventListener('change', () => {
      tablePaginationState.installments.page = 1;
      renderInstallmentsTable();
    });
    document.getElementById('installments-page-size')?.addEventListener('change', (e) => {
      tablePaginationState.installments.pageSize = e.target.value;
      tablePaginationState.installments.page = 1;
      renderInstallmentsTable();
    });
    document.getElementById('btn-reset-inst-filters')?.addEventListener('click', () => {
      const s = document.getElementById('inst-search-input');
      const st = document.getElementById('inst-status-filter');
      if (s) s.value = '';
      if (st) st.value = '';
      tablePaginationState.installments.page = 1;
      userScopedFilters.installmentsShowAll = false;
      renderInstallmentsTable();
    });

    document.getElementById('btn-export-installments-csv')?.addEventListener('click', () => {
      const headers = ["Installment No", "Holder Name", "Policy Number", "Due Date", "Amount", "Status"];
      const rows = state.installments.map(i => {
        const holder = state.holders.find(h => h.id === i.holder_id) || {};
        return [
          `"${i.installment_no} of ${i.total_installments}"`,
          `"${holder.name || '-'}"`,
          `"${holder.policy_number || '-'}"`,
          i.due_date,
          i.amount,
          i.status
        ];
      });
      downloadCSV("Installments_Tracking_Report.csv", [headers, ...rows]);
      showToast('Export Complete', 'Exported installment schedule CSV', 'success');
    });
  }

  // =========================================================================
  // 9. Due Date & Grace Period Management (User-Dependent Scoping)
  // =========================================================================
  function renderDueDatesTable() {
    const tbody = document.getElementById('due-dates-table-tbody');
    const noticeContainer = document.getElementById('due-dates-scope-notice-container');
    const urgencyFilter = document.getElementById('due-filter-urgency')?.value || '';
    if (!tbody) return;

    const user = state.currentUser;
    let baseList = state.holders;

    if (noticeContainer) {
      if (user && user.role === 'Policyholder') {
        const myHolder = state.holders.find(h => 
          (user.policyNo && h.policy_number === user.policyNo) || 
          h.name.toLowerCase() === user.name.toLowerCase()
        );
        const myRecord = myHolder ? [myHolder] : [state.holders[0]];

        if (!userScopedFilters.dueDatesShowAll) {
          baseList = myRecord;
          noticeContainer.innerHTML = `
            <div class="portfolio-filter-notice">
              <div>
                <i class="fa-solid fa-clock text-warning"></i> <strong>My Policy Due Date & Grace Period:</strong> 
                Tracking deadline for <strong>${escapeHTML(user.name)}</strong> (<code>${user.policyNo || 'LIC-12345'}</code>)
              </div>
              <button type="button" class="btn btn-outline btn-sm" id="btn-toggle-due-scope">
                <i class="fa-solid fa-list"></i> View All Branch Policies (${state.holders.length})
              </button>
            </div>
          `;
        } else {
          noticeContainer.innerHTML = `
            <div class="portfolio-filter-notice">
              <div>
                <i class="fa-solid fa-globe text-muted"></i> <strong>Branch Wide Due Dates:</strong> Showing all branch due schedules.
              </div>
              <button type="button" class="btn btn-primary btn-sm" id="btn-toggle-due-scope">
                <i class="fa-solid fa-user-shield"></i> Show Only My Due Date
              </button>
            </div>
          `;
        }
      } else if (user && user.role === 'Agent') {
        const agentCode = user.agentCode || 'AG-102';
        const myClients = state.holders.filter(h => 
          h.agent_name && (h.agent_name.includes(agentCode) || h.agent_name.includes(user.name))
        );

        if (!userScopedFilters.dueDatesShowAll) {
          baseList = myClients;
          noticeContainer.innerHTML = `
            <div class="portfolio-filter-notice">
              <div>
                <i class="fa-solid fa-user-tag text-primary"></i> <strong>Advisor Portfolio Dues:</strong> 
                Tracking grace periods for clients of <strong>${escapeHTML(user.name)}</strong> (<code>${agentCode}</code>)
              </div>
              <button type="button" class="btn btn-outline btn-sm" id="btn-toggle-due-scope">
                <i class="fa-solid fa-list"></i> View All Branch Policies (${state.holders.length})
              </button>
            </div>
          `;
        } else {
          noticeContainer.innerHTML = `
            <div class="portfolio-filter-notice">
              <div>
                <i class="fa-solid fa-globe text-muted"></i> <strong>All Branch Due Dates:</strong> Showing all branch clients.
              </div>
              <button type="button" class="btn btn-primary btn-sm" id="btn-toggle-due-scope">
                <i class="fa-solid fa-filter"></i> Filter to My Portfolio (${myClients.length})
              </button>
            </div>
          `;
        }
      } else {
        noticeContainer.innerHTML = '';
      }

      document.getElementById('btn-toggle-due-scope')?.addEventListener('click', () => {
        userScopedFilters.dueDatesShowAll = !userScopedFilters.dueDatesShowAll;
        renderDueDatesTable();
      });
    }

    let list = baseList.map(h => {
      const days = getDaysDifference(h.next_due_date);
      let cat = 'upcoming';
      if (days < -30) cat = 'lapsed';
      else if (days < 0) cat = 'grace';
      return { ...h, days, cat };
    });

    if (urgencyFilter) {
      list = list.filter(item => item.cat === urgencyFilter);
    }

    list.sort((a, b) => a.days - b.days);

    if (list.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" class="text-center text-muted">No policy records matching urgency category.</td></tr>`;
      document.getElementById('due-dates-pagination-bar')?.classList.add('hidden');
      return;
    }

    document.getElementById('due-dates-pagination-bar')?.classList.remove('hidden');

    const pSize = tablePaginationState.dueDates.pageSize === 'all' ? list.length : parseInt(tablePaginationState.dueDates.pageSize, 10);
    const totalPages = Math.ceil(list.length / pSize) || 1;
    if (tablePaginationState.dueDates.page > totalPages) tablePaginationState.dueDates.page = 1;
    const start = (tablePaginationState.dueDates.page - 1) * pSize;
    const pageItems = tablePaginationState.dueDates.pageSize === 'all' ? list : list.slice(start, start + pSize);

    tbody.innerHTML = pageItems.map(item => {
      let daysText = '';
      let graceBadge = '';

      if (item.cat === 'lapsed') {
        daysText = `<span class="text-danger font-bold">${Math.abs(item.days)} days OVERDUE</span>`;
        graceBadge = `<span class="badge badge-danger">Lapsed (&gt;30d grace expired)</span>`;
      } else if (item.cat === 'grace') {
        daysText = `<span class="text-warning font-bold">${Math.abs(item.days)} days past due</span>`;
        graceBadge = `<span class="badge badge-warning">Grace Period (${30 - Math.abs(item.days)}d left)</span>`;
      } else {
        daysText = `<span class="text-muted font-bold">${item.days} days remaining</span>`;
        graceBadge = `<span class="badge badge-success">Regular Window</span>`;
      }

      return `
        <tr>
          <td>
            <strong>${escapeHTML(item.name)}</strong>
            <div class="text-xs text-muted">${escapeHTML(item.phone || '')}</div>
          </td>
          <td><code>${escapeHTML(item.policy_number)}</code></td>
          <td>${formatDate(item.next_due_date)}</td>
          <td>${daysText}</td>
          <td>${graceBadge}</td>
          <td><strong>${formatINR(item.premium_amount)}</strong></td>
          <td class="text-right">
            <button class="btn btn-outline btn-sm btn-open-reminder" data-id="${item.id}" title="Send Simulated Reminder">
              <i class="fa-solid fa-paper-plane"></i> Remind
            </button>
            <button class="btn btn-primary btn-sm btn-pay-due" data-id="${item.id}" title="Collect Payment">
              <i class="fa-solid fa-receipt"></i> Pay
            </button>
          </td>
        </tr>
      `;
    }).join('');

    tbody.querySelectorAll('.btn-open-reminder').forEach(btn => {
      btn.addEventListener('click', () => {
        openReminderModal(btn.dataset.id);
      });
    });

    tbody.querySelectorAll('.btn-pay-due').forEach(btn => {
      btn.addEventListener('click', () => {
        window.location.hash = '#payment';
        selectHolderInPaymentForm(btn.dataset.id);
      });
    });

    renderPaginationControls('due-dates-pagination-nav', 'due-dates-pagination-info', list.length, tablePaginationState.dueDates, renderDueDatesTable);
  }

  function initDueDateFilters() {
    document.getElementById('due-filter-urgency')?.addEventListener('change', () => {
      tablePaginationState.dueDates.page = 1;
      renderDueDatesTable();
    });
    document.getElementById('due-dates-page-size')?.addEventListener('change', (e) => {
      tablePaginationState.dueDates.pageSize = e.target.value;
      tablePaginationState.dueDates.page = 1;
      renderDueDatesTable();
    });

    document.getElementById('btn-send-bulk-reminders')?.addEventListener('click', () => {
      const count = state.holders.filter(h => getDaysDifference(h.next_due_date) <= 30).length;
      showToast('Bulk Reminders Sent', `Successfully dispatched ${count} automated SMS/Email reminders to policyholders!`, 'warning');
      state.notifications.unshift({
        id: Date.now(),
        title: "Bulk Reminders Dispatched",
        text: `Sent notification blast to ${count} policyholders with active grace periods.`,
        time: "Just now",
        type: "info"
      });
      persistAll();
    });

    document.getElementById('btn-dispatch-reminder')?.addEventListener('click', () => {
      const name = document.getElementById('reminder-recipient-name')?.textContent;
      closeModal('modal-reminder');
      showToast('Reminder Sent', `Simulated reminder dispatched to ${name} via selected channels!`, 'success');
    });
  }

  function openReminderModal(holderId) {
    const holder = state.holders.find(h => h.id === parseInt(holderId, 10));
    if (!holder) return;

    const days = getDaysDifference(holder.next_due_date);
    document.getElementById('reminder-holder-id').value = holder.id;
    document.getElementById('reminder-recipient-name').textContent = holder.name;
    document.getElementById('reminder-recipient-policy').textContent = `Policy: ${holder.policy_number} • Premium: ${formatINR(holder.premium_amount)}`;

    const badge = document.getElementById('reminder-recipient-due-badge');
    if (days < 0) {
      badge.className = 'badge badge-danger';
      badge.textContent = `Overdue (${Math.abs(days)} days)`;
    } else {
      badge.className = 'badge badge-warning';
      badge.textContent = `Due in ${days} days`;
    }

    const template = `Dear ${holder.name},\nThis is a friendly reminder from Data Alcott Insurance Services regarding your policy ${holder.policy_number}. Your premium of ${formatINR(holder.premium_amount)} is scheduled for ${formatDate(holder.next_due_date)}. Kindly pay online or at our branch to ensure continuous life coverage.`;
    document.getElementById('reminder-message-preview').value = template;

    openModal('modal-reminder');
  }

  // =========================================================================
  // 10. Receipt Generation & Printing Module (User-Dependent Attribution)
  // =========================================================================
  function renderReceiptView() {
    const selector = document.getElementById('receipt-selector-dropdown');
    if (!selector) return;

    const user = state.currentUser;
    let availableReceipts = state.receipts;

    if (user && user.role === 'Policyholder') {
      const myReceipts = state.receipts.filter(r => 
        (user.policyNo && r.policy_no === user.policyNo) || 
        (r.holder_name && r.holder_name.toLowerCase() === user.name.toLowerCase())
      );
      if (myReceipts.length > 0) {
        availableReceipts = myReceipts;
        if (!availableReceipts.some(r => r.id === state.activeReceiptId)) {
          state.activeReceiptId = availableReceipts[availableReceipts.length - 1].id;
        }
      }
    }

    selector.innerHTML = availableReceipts.map(r => `
      <option value="${r.id}" ${r.id === state.activeReceiptId ? 'selected' : ''}>
        ${r.receipt_no} - ${r.holder_name} (${formatINR(r.total_amount || r.amount)}) - ${r.date}
      </option>
    `).join('');

    selector.onchange = (e) => {
      state.activeReceiptId = parseInt(e.target.value, 10);
      populateOfficialReceiptCard();
    };

    populateOfficialReceiptCard();
  }

  function populateOfficialReceiptCard() {
    const rcpt = state.receipts.find(r => r.id === state.activeReceiptId) || state.receipts[state.receipts.length - 1];
    if (!rcpt) return;

    const holder = state.holders.find(h => h.id === rcpt.holder_id) || {
      name: rcpt.holder_name,
      policy_number: rcpt.policy_no,
      plan_name: rcpt.plan_name,
      phone: "+91 98765 43210",
      email: "insured@example.com",
      payment_frequency: "Yearly",
      next_due_date: "2027-10-13"
    };

    document.getElementById('rcpt-number').textContent = rcpt.receipt_no;
    document.getElementById('rcpt-date').textContent = formatDate(rcpt.date);
    document.getElementById('rcpt-time').textContent = rcpt.time || "10:00 AM";

    document.getElementById('rcpt-holder-name').textContent = rcpt.holder_name || holder.name;
    document.getElementById('rcpt-policy-no').textContent = rcpt.policy_no || holder.policy_number;
    document.getElementById('rcpt-mobile').textContent = holder.phone || '+91 98765 43210';
    document.getElementById('rcpt-email').textContent = holder.email || 'insured@example.com';

    document.getElementById('rcpt-plan-name').textContent = rcpt.plan_name || holder.plan_name || 'Standard Life Plan';
    document.getElementById('rcpt-freq').textContent = holder.payment_frequency || 'Yearly';
    document.getElementById('rcpt-due-date').textContent = formatDate(rcpt.date);
    document.getElementById('rcpt-next-due').textContent = formatDate(holder.next_due_date);

    document.getElementById('rcpt-installment-desc').textContent = rcpt.period_desc || `${holder.payment_frequency} insurance installment`;
    document.getElementById('rcpt-base-amount').textContent = formatINR(rcpt.amount);
    document.getElementById('rcpt-late-fee').textContent = formatINR(rcpt.late_fee || 0);

    const total = rcpt.total_amount || (rcpt.amount + (rcpt.late_fee || 0));
    document.getElementById('rcpt-total-amount').textContent = formatINR(total);
    document.getElementById('rcpt-words').textContent = numberToWordsINR(total);

    document.getElementById('rcpt-method').textContent = rcpt.payment_method || 'UPI';
    document.getElementById('rcpt-ref').textContent = rcpt.reference_no || 'TXN-92819201';

    const collectorDisplay = document.getElementById('rcpt-collector');
    if (collectorDisplay) {
      collectorDisplay.textContent = rcpt.collector || `${state.currentUser.name} (${state.currentUser.deskId || state.currentUser.agentCode || 'Counter Desk'})`;
    }

    const signatoryText = document.getElementById('rcpt-signatory');
    if (signatoryText) {
      if (state.currentUser.role === 'Admin') {
        signatoryText.textContent = `${state.currentUser.name} (Branch Manager)`;
      } else if (state.currentUser.role === 'Cashier') {
        signatoryText.textContent = `${state.currentUser.name} (Authorized Cashier)`;
      } else if (state.currentUser.role === 'Agent') {
        signatoryText.textContent = `${state.currentUser.name} (Senior Advisor)`;
      } else {
        signatoryText.textContent = 'Vikramaditya Singh (Branch Manager)';
      }
    }
  }

  function initReceiptActions() {
    document.getElementById('btn-print-receipt')?.addEventListener('click', () => {
      window.print();
    });

    document.getElementById('btn-email-sim-receipt')?.addEventListener('click', () => {
      const email = document.getElementById('rcpt-email')?.textContent;
      showToast('Receipt Dispatched', `Receipt PDF successfully emailed to ${email}`, 'success');
    });
  }

  // =========================================================================
  // 11. Payment History Ledger Module
  // =========================================================================
  function renderHistoryTable() {
    const tbody = document.getElementById('history-table-tbody');
    const searchVal = document.getElementById('history-search-input')?.value.toLowerCase().trim() || '';
    const methodVal = document.getElementById('history-method-filter')?.value || '';
    const statusVal = document.getElementById('history-status-filter')?.value || '';

    if (!tbody) return;

    let filtered = [...state.payments].reverse().filter(p => {
      const holder = state.holders.find(h => h.id === p.holder_id) || {};
      const matchSearch = !searchVal ||
        (p.receipt_no && p.receipt_no.toLowerCase().includes(searchVal)) ||
        (p.reference_no && p.reference_no.toLowerCase().includes(searchVal)) ||
        (holder.name && holder.name.toLowerCase().includes(searchVal)) ||
        (holder.policy_number && holder.policy_number.toLowerCase().includes(searchVal));

      const matchMethod = !methodVal || p.payment_method === methodVal;
      const matchStatus = !statusVal || p.status === statusVal;

      return matchSearch && matchMethod && matchStatus;
    });

    if (filtered.length === 0) {
      tbody.innerHTML = `<tr><td colspan="9" class="text-center text-muted">No transactions found matching filter criteria.</td></tr>`;
      return;
    }

    tbody.innerHTML = filtered.map(p => {
      const holder = state.holders.find(h => h.id === p.holder_id) || {};
      return `
        <tr>
          <td>${formatDate(p.paid_date)}</td>
          <td><code>${escapeHTML(p.receipt_no || '-')}</code></td>
          <td><strong>${escapeHTML(holder.name || '-')}</strong></td>
          <td><code>${escapeHTML(holder.policy_number || '-')}</code></td>
          <td><span class="badge badge-neutral">${escapeHTML(p.payment_method)}</span></td>
          <td><small>${escapeHTML(p.reference_no || '-')}</small></td>
          <td><strong>${formatINR(p.total_amount || p.amount)}</strong></td>
          <td><span class="badge badge-success">${escapeHTML(p.status)}</span></td>
          <td class="text-right">
            <button class="btn btn-outline btn-sm btn-history-rcpt" data-rcpt="${p.receipt_no}">
              <i class="fa-solid fa-receipt"></i>
            </button>
          </td>
        </tr>
      `;
    }).join('');

    tbody.querySelectorAll('.btn-history-rcpt').forEach(btn => {
      btn.addEventListener('click', () => {
        const rcptNo = btn.dataset.rcpt;
        const targetRcpt = state.receipts.find(r => r.receipt_no === rcptNo);
        if (targetRcpt) {
          state.activeReceiptId = targetRcpt.id;
          window.location.hash = '#receipt';
          renderReceiptView();
        }
      });
    });
  }

  function initHistoryFilters() {
    document.getElementById('history-search-input')?.addEventListener('input', renderHistoryTable);
    document.getElementById('history-method-filter')?.addEventListener('change', renderHistoryTable);
    document.getElementById('history-status-filter')?.addEventListener('change', renderHistoryTable);
    document.getElementById('btn-reset-history-filters')?.addEventListener('click', () => {
      const s = document.getElementById('history-search-input');
      const m = document.getElementById('history-method-filter');
      const st = document.getElementById('history-status-filter');
      if (s) s.value = '';
      if (m) m.value = '';
      if (st) st.value = '';
      renderHistoryTable();
    });

    document.getElementById('btn-export-history-csv')?.addEventListener('click', () => {
      const headers = ["Date", "Receipt No", "Holder Name", "Policy Number", "Payment Method", "Reference", "Amount", "Status"];
      const rows = state.payments.map(p => {
        const holder = state.holders.find(h => h.id === p.holder_id) || {};
        return [
          p.paid_date,
          `"${p.receipt_no || '-'}"`,
          `"${holder.name || '-'}"`,
          `"${holder.policy_number || '-'}"`,
          `"${p.payment_method}"`,
          `"${p.reference_no || '-'}"`,
          p.total_amount || p.amount,
          p.status
        ];
      });
      downloadCSV("Payment_Ledger_Export.csv", [headers, ...rows]);
      showToast('Export Complete', 'Exported complete payment history CSV', 'success');
    });
  }

  // =========================================================================
  // 12. Payment Reconciliation Module
  // =========================================================================
  function renderReconciliationTable() {
    const tbody = document.getElementById('reconciliation-table-tbody');
    const noticeContainer = document.getElementById('recon-scope-notice-container');
    if (!tbody) return;

    const user = state.currentUser;
    if (noticeContainer) {
      if (user && user.role === 'Policyholder') {
        noticeContainer.innerHTML = `
          <div class="portfolio-filter-notice">
            <div>
              <i class="fa-solid fa-lock text-info"></i> <strong>Read-Only Member Transparency View:</strong> 
              Physical cash drawer & automated gateway reconciliation is managed by branch cashiers & administrators.
            </div>
            <span class="badge badge-success"><i class="fa-solid fa-check-double"></i> 100% Solvency Audited</span>
          </div>
        `;
      } else {
        noticeContainer.innerHTML = '';
      }
    }

    const totalSystem = state.reconciliation.reduce((s, r) => s + (r.expected || 0), 0);
    const totalBank = state.reconciliation.reduce((s, r) => s + (r.actual || 0), 0);
    const variance = totalBank - totalSystem;

    document.getElementById('recon-stat-system').textContent = formatINR(totalSystem);
    document.getElementById('recon-stat-bank').textContent = formatINR(totalBank);

    const varianceEl = document.getElementById('recon-stat-variance');
    const varianceSub = document.getElementById('recon-stat-variance-sub');
    const statusBadge = document.getElementById('recon-stat-status-badge');

    if (varianceEl) {
      varianceEl.textContent = formatINR(Math.abs(variance));
      varianceEl.className = variance === 0 ? 'stat-value text-success' : 'stat-value text-warning';
    }

    if (varianceSub) {
      varianceSub.textContent = variance === 0 ? 'Zero variance - 100% matched' : (variance < 0 ? 'Net negative variance' : 'Surplus');
    }

    if (statusBadge) {
      statusBadge.textContent = variance === 0 ? 'Balanced' : 'Audited / Adjusted';
      statusBadge.className = variance === 0 ? 'stat-value text-success' : 'stat-value text-warning';
    }

    tbody.innerHTML = state.reconciliation.map(r => {
      let badge = '<span class="badge badge-success">Reconciled</span>';
      if (r.variance !== 0) badge = '<span class="badge badge-warning">Adjusted</span>';

      return `
        <tr>
          <td><strong>${formatDate(r.date)}</strong></td>
          <td>${escapeHTML(r.channel)}</td>
          <td>${formatINR(r.expected)}</td>
          <td><strong>${formatINR(r.actual)}</strong></td>
          <td class="${r.variance === 0 ? 'text-success' : 'text-danger'}">${formatINR(r.variance)}</td>
          <td>${badge}</td>
          <td><small class="text-muted">${escapeHTML(r.reconciled_by || 'Cashier')}</small></td>
          <td class="text-right">
            <button class="btn btn-outline btn-sm btn-recon-details" data-id="${r.id}">
              <i class="fa-solid fa-file-shield"></i> Audit Note
            </button>
          </td>
        </tr>
      `;
    }).join('');

    tbody.querySelectorAll('.btn-recon-details').forEach(btn => {
      btn.addEventListener('click', () => {
        const item = state.reconciliation.find(r => r.id === parseInt(btn.dataset.id, 10));
        if (item) {
          alert(`Reconciliation Audit Note:\n\nChannel: ${item.channel}\nDate: ${item.date}\nSystem Expected: ${formatINR(item.expected)}\nBank Deposited: ${formatINR(item.actual)}\nVariance: ${formatINR(item.variance)}\n\nNotes: ${item.notes || 'No remarks entered'}`);
        }
      });
    });
  }

  function initReconciliationActions() {
    document.getElementById('btn-run-auto-reconciliation')?.addEventListener('click', () => {
      showToast('Reconciliation Complete', 'Automated settlement sync verified all collections against banking gateway.', 'success');
      state.notifications.unshift({
        id: Date.now(),
        title: "Daily Settlement Synced",
        text: "Automated end-of-day bank ledger reconciliation completed with zero unassigned discrepancies.",
        time: "Just now",
        type: "success"
      });
      persistAll();
    });
  }

  // =========================================================================
  // 13. Reports & Analytics Module
  // =========================================================================
  function generateSelectedReport() {
    const reportType = document.getElementById('report-type-select')?.value || 'collection';
    const period = document.getElementById('report-period-select')?.value || 'this_month';

    const titleEl = document.getElementById('report-heading-title');
    const periodEl = document.getElementById('report-heading-period');
    const kpiRow = document.getElementById('report-kpi-row');
    const thead = document.getElementById('report-table-thead');
    const tbody = document.getElementById('report-table-tbody');
    const timestamp = document.getElementById('report-gen-timestamp');

    if (timestamp) {
      timestamp.textContent = `Generated on: ${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}`;
    }

    if (reportType === 'collection') {
      if (titleEl) titleEl.textContent = 'Premium Collection Summary Statement';
      if (periodEl) periodEl.textContent = `Filter: ${period.toUpperCase()} • Entity: Data Alcott Insurance Premium Collection Desk`;

      const totalCollections = state.payments.reduce((s, p) => s + (p.total_amount || p.amount || 0), 0);
      const totalCount = state.payments.length;
      const avgCollection = totalCount > 0 ? Math.round(totalCollections / totalCount) : 0;

      if (kpiRow) {
        kpiRow.innerHTML = `
          <div class="report-kpi-card">
            <div class="kpi-label">Total Realized Collections</div>
            <div class="kpi-val text-success">${formatINR(totalCollections)}</div>
          </div>
          <div class="report-kpi-card">
            <div class="kpi-label">Transactions Processed</div>
            <div class="kpi-val">${totalCount}</div>
          </div>
          <div class="report-kpi-card">
            <div class="kpi-label">Average Ticket Size</div>
            <div class="kpi-val">${formatINR(avgCollection)}</div>
          </div>
          <div class="report-kpi-card">
            <div class="kpi-label">Collection Efficiency</div>
            <div class="kpi-val text-primary">94.8%</div>
          </div>
        `;
      }

      if (thead) {
        thead.innerHTML = `
          <tr>
            <th>Receipt #</th>
            <th>Posting Date</th>
            <th>Policy Holder</th>
            <th>Policy No</th>
            <th>Mode</th>
            <th>Ref / Txn No</th>
            <th class="text-right">Collected (₹)</th>
          </tr>
        `;
      }

      if (tbody) {
        tbody.innerHTML = state.payments.map(p => {
          const holder = state.holders.find(h => h.id === p.holder_id) || {};
          return `
            <tr>
              <td><code>${escapeHTML(p.receipt_no || '-')}</code></td>
              <td>${formatDate(p.paid_date)}</td>
              <td><strong>${escapeHTML(holder.name || '-')}</strong></td>
              <td><code>${escapeHTML(holder.policy_number || '-')}</code></td>
              <td>${escapeHTML(p.payment_method)}</td>
              <td><small>${escapeHTML(p.reference_no || '-')}</small></td>
              <td class="text-right"><strong>${formatINR(p.total_amount || p.amount)}</strong></td>
            </tr>
          `;
        }).join('');
      }

    } else if (reportType === 'defaulters') {
      if (titleEl) titleEl.textContent = 'Defaulters & Due Date Aging Analysis';
      if (periodEl) periodEl.textContent = 'Accounts in Grace Window & Lapsed Risk Categories';

      const overdueAccounts = state.holders.filter(h => getDaysDifference(h.next_due_date) < 0);
      const overdueTotal = overdueAccounts.reduce((s, h) => s + (h.premium_amount || 0), 0);

      if (kpiRow) {
        kpiRow.innerHTML = `
          <div class="report-kpi-card">
            <div class="kpi-label">Overdue Outstanding</div>
            <div class="kpi-val text-danger">${formatINR(overdueTotal)}</div>
          </div>
          <div class="report-kpi-card">
            <div class="kpi-label">Policies at Risk</div>
            <div class="kpi-val text-warning">${overdueAccounts.length}</div>
          </div>
          <div class="report-kpi-card">
            <div class="kpi-label">Reminders Dispatched</div>
            <div class="kpi-val">${state.notifications.length}</div>
          </div>
        `;
      }

      if (thead) {
        thead.innerHTML = `
          <tr>
            <th>Policy Holder</th>
            <th>Policy No</th>
            <th>Due Date</th>
            <th>Aging Category</th>
            <th>Phone / Contact</th>
            <th class="text-right">Due Premium (₹)</th>
          </tr>
        `;
      }

      if (tbody) {
        tbody.innerHTML = overdueAccounts.map(h => {
          const days = getDaysDifference(h.next_due_date);
          return `
            <tr>
              <td><strong>${escapeHTML(h.name)}</strong></td>
              <td><code>${escapeHTML(h.policy_number)}</code></td>
              <td>${formatDate(h.next_due_date)}</td>
              <td><span class="badge ${days < -30 ? 'badge-danger' : 'badge-warning'}">${days < -30 ? 'Critical Lapsed' : 'Grace Period Active'}</span></td>
              <td>${escapeHTML(h.phone || '-')}</td>
              <td class="text-right"><strong>${formatINR(h.premium_amount)}</strong></td>
            </tr>
          `;
        }).join('');
      }

    } else if (reportType === 'frequency') {
      if (titleEl) titleEl.textContent = 'Collections by Premium Frequency Breakdown';
      if (periodEl) periodEl.textContent = 'Distribution analysis across Yearly, Half-Yearly, Quarterly, Monthly';

      const freqMap = {};
      state.holders.forEach(h => {
        const f = h.payment_frequency || 'Yearly';
        if (!freqMap[f]) freqMap[f] = { count: 0, premium: 0 };
        freqMap[f].count++;
        freqMap[f].premium += (h.premium_amount || 0);
      });

      if (kpiRow) {
        kpiRow.innerHTML = `
          <div class="report-kpi-card">
            <div class="kpi-label">Yearly Mode Share</div>
            <div class="kpi-val text-primary">${freqMap['Yearly'] ? freqMap['Yearly'].count : 0} policies</div>
          </div>
          <div class="report-kpi-card">
            <div class="kpi-label">Monthly Mode Share</div>
            <div class="kpi-val">${freqMap['Monthly'] ? freqMap['Monthly'].count : 0} policies</div>
          </div>
          <div class="report-kpi-card">
            <div class="kpi-label">Half-Yearly Share</div>
            <div class="kpi-val">${freqMap['Half-Yearly'] ? freqMap['Half-Yearly'].count : 0} policies</div>
          </div>
        `;
      }

      if (thead) {
        thead.innerHTML = `
          <tr>
            <th>Payment Frequency</th>
            <th>Number of Active Policies</th>
            <th>Average Installment (₹)</th>
            <th class="text-right">Total Annualized Value (₹)</th>
          </tr>
        `;
      }

      if (tbody) {
        tbody.innerHTML = Object.keys(freqMap).map(f => {
          const item = freqMap[f];
          const avg = Math.round(item.premium / item.count);
          return `
            <tr>
              <td><strong>${escapeHTML(f)}</strong></td>
              <td>${item.count}</td>
              <td>${formatINR(avg)}</td>
              <td class="text-right"><strong>${formatINR(item.premium)}</strong></td>
            </tr>
          `;
        }).join('');
      }
    } else if (reportType === 'agent_portfolio') {
      const user = state.currentUser;
      const agentCode = user && user.role === 'Agent' ? (user.agentCode || 'AG-102') : 'AG-102';
      const agentName = user && user.role === 'Agent' ? user.name : 'R. K. Verma';
      
      if (titleEl) titleEl.textContent = `Agent Portfolio & Renewal Commission Statement: ${agentName}`;
      if (periodEl) periodEl.textContent = `Advisor Code: ${agentCode} • Entity: Data Alcott Insurance Services • Assigned Portfolio`;

      const myClients = state.holders.filter(h => 
        h.agent_name && (h.agent_name.includes(agentCode) || h.agent_name.includes(agentName))
      );
      const totalSumAssured = myClients.reduce((s, h) => s + (h.sum_assured || 0), 0);
      const totalAnnualPremium = myClients.reduce((s, h) => s + (h.premium_amount || 0), 0);
      const estCommission = Math.round(totalAnnualPremium * 0.10);

      if (kpiRow) {
        kpiRow.innerHTML = `
          <div class="report-kpi-card">
            <div class="kpi-label">Assigned Portfolio Size</div>
            <div class="kpi-val text-primary">${myClients.length} Clients</div>
          </div>
          <div class="report-kpi-card">
            <div class="kpi-label">Total Sum Assured Under Care</div>
            <div class="kpi-val">${formatINR(totalSumAssured)}</div>
          </div>
          <div class="report-kpi-card">
            <div class="kpi-label">Annualized Portfolio Premium</div>
            <div class="kpi-val text-success">${formatINR(totalAnnualPremium)}</div>
          </div>
          <div class="report-kpi-card">
            <div class="kpi-label">Estimated Advisor Commission (10%)</div>
            <div class="kpi-val text-warning">${formatINR(estCommission)}</div>
          </div>
        `;
      }

      if (thead) {
        thead.innerHTML = `
          <tr>
            <th>Client Name</th>
            <th>Policy Number</th>
            <th>Plan Name</th>
            <th>Sum Assured</th>
            <th>Premium</th>
            <th>Next Due Date</th>
            <th class="text-right">Projected Commission</th>
          </tr>
        `;
      }

      if (tbody) {
        tbody.innerHTML = myClients.map(h => `
          <tr>
            <td><strong>${escapeHTML(h.name)}</strong></td>
            <td><code>${escapeHTML(h.policy_number)}</code></td>
            <td>${escapeHTML(h.plan_name)}</td>
            <td>${formatINR(h.sum_assured)}</td>
            <td><strong>${formatINR(h.premium_amount)}</strong></td>
            <td>${formatDate(h.next_due_date)}</td>
            <td class="text-right text-success"><strong>${formatINR(Math.round(h.premium_amount * 0.10))}</strong></td>
          </tr>
        `).join('');
      }

    } else if (reportType === 'tax_cert') {
      const user = state.currentUser;
      const targetHolder = state.holders.find(h => 
        (user.policyNo && h.policy_number === user.policyNo) || 
        h.name.toLowerCase() === user.name.toLowerCase()
      ) || state.holders[0];

      const holderPayments = state.payments.filter(p => p.holder_id === targetHolder.id && p.status === 'Paid');
      const totalPaidYear = holderPayments.reduce((s, p) => s + (p.total_amount || p.amount || 0), 0) || targetHolder.premium_amount;

      if (titleEl) titleEl.textContent = `Annual Premium Tax Certificate (Section 80C) - FY 2026-27`;
      if (periodEl) periodEl.textContent = `Certificate issued under Section 80C of the Income Tax Act, 1961 for ${targetHolder.name}`;

      if (kpiRow) {
        kpiRow.innerHTML = `
          <div class="report-kpi-card">
            <div class="kpi-label">Insured Policyholder</div>
            <div class="kpi-val text-primary">${escapeHTML(targetHolder.name)}</div>
          </div>
          <div class="report-kpi-card">
            <div class="kpi-label">Insurance Policy Number</div>
            <div class="kpi-val font-mono">${escapeHTML(targetHolder.policy_number)}</div>
          </div>
          <div class="report-kpi-card">
            <div class="kpi-label">Total 80C Eligible Premium</div>
            <div class="kpi-val text-success">${formatINR(totalPaidYear)}</div>
          </div>
          <div class="report-kpi-card">
            <div class="kpi-label">IT Act Deductible Status</div>
            <div class="kpi-val text-success"><span class="badge badge-success">100% Eligible</span></div>
          </div>
        `;
      }

      if (thead) {
        thead.innerHTML = `
          <tr>
            <th>Tax Benefit Category</th>
            <th>Policy & Plan</th>
            <th>Sum Assured</th>
            <th>Premium Payment Mode</th>
            <th>Certification Authority</th>
            <th class="text-right">Tax Deductible Premium (₹)</th>
          </tr>
        `;
      }

      if (tbody) {
        tbody.innerHTML = `
          <tr>
            <td>
              <strong>Section 80C Life Insurance Premium</strong><br>
              <small class="text-muted">Life Insurance Corporation of India (LIC) Plan Standard</small>
            </td>
            <td>
              <strong>${escapeHTML(targetHolder.policy_number)}</strong><br>
              <small>${escapeHTML(targetHolder.plan_name)}</small>
            </td>
            <td>${formatINR(targetHolder.sum_assured)}</td>
            <td>${escapeHTML(targetHolder.payment_frequency)} via Banking Channel</td>
            <td>
              <span class="tax-cert-seal"><i class="fa-solid fa-stamp"></i> CERTIFIED DAS-LIC-003</span>
            </td>
            <td class="text-right">
              <strong class="text-success" style="font-size: 1.15rem;">${formatINR(totalPaidYear)}</strong>
            </td>
          </tr>
        `;
      }

    } else {
      if (titleEl) titleEl.textContent = 'Batch Reconciliation & Settlement Audit';
      if (periodEl) periodEl.textContent = 'Bank Ledger vs Counter Deposits Verification';

      if (thead) {
        thead.innerHTML = `
          <tr>
            <th>Date</th>
            <th>Channel</th>
            <th>System Expected (₹)</th>
            <th>Bank Settled (₹)</th>
            <th>Variance (₹)</th>
            <th>Status</th>
            <th>Audited By</th>
          </tr>
        `;
      }

      if (tbody) {
        tbody.innerHTML = state.reconciliation.map(r => `
          <tr>
            <td>${formatDate(r.date)}</td>
            <td>${escapeHTML(r.channel)}</td>
            <td>${formatINR(r.expected)}</td>
            <td><strong>${formatINR(r.actual)}</strong></td>
            <td class="${r.variance === 0 ? 'text-success' : 'text-danger'}">${formatINR(r.variance)}</td>
            <td><span class="badge ${r.variance === 0 ? 'badge-success' : 'badge-warning'}">${r.status}</span></td>
            <td><small>${escapeHTML(r.reconciled_by)}</small></td>
          </tr>
        `).join('');
      }
    }
  }

  function initReportActions() {
    document.getElementById('btn-generate-report')?.addEventListener('click', generateSelectedReport);
    document.getElementById('report-type-select')?.addEventListener('change', generateSelectedReport);
    document.getElementById('report-period-select')?.addEventListener('change', generateSelectedReport);

    document.getElementById('btn-print-active-report')?.addEventListener('click', () => {
      window.print();
    });

    document.getElementById('btn-export-active-report-csv')?.addEventListener('click', () => {
      const type = document.getElementById('report-type-select')?.value || 'collection';
      const thead = document.getElementById('report-table-thead');
      const tbody = document.getElementById('report-table-tbody');

      if (!thead || !tbody) return;

      const headers = Array.from(thead.querySelectorAll('th')).map(th => `"${th.textContent.trim()}"`);
      const rows = Array.from(tbody.querySelectorAll('tr')).map(tr => 
        Array.from(tr.querySelectorAll('td')).map(td => `"${td.textContent.trim().replace(/"/g, '""')}"`)
      );

      downloadCSV(`Premium_Report_${type}.csv`, [headers, ...rows]);
      showToast('Report Downloaded', `Exported ${type} report as CSV`, 'success');
    });
  }

  // =========================================================================
  // 14. Bulk Payment Entry Modal
  // =========================================================================
  function initBulkPaymentModal() {
    const modal = document.getElementById('modal-bulk-payment');
    const tbody = document.getElementById('bulk-entry-tbody');
    const totalDisplay = document.getElementById('bulk-batch-total-display');

    document.getElementById('btn-open-bulk-modal')?.addEventListener('click', () => {
      renderBulkRows();
      openModal('modal-bulk-payment');
    });

    document.getElementById('btn-add-bulk-row')?.addEventListener('click', () => {
      addBulkRow();
    });

    function renderBulkRows() {
      if (!tbody) return;
      tbody.innerHTML = '';
      for (let i = 0; i < 3; i++) {
        addBulkRow();
      }
      updateBulkTotal();
    }

    function addBulkRow() {
      const rowIdx = tbody.children.length + 1;
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${rowIdx}</td>
        <td>
          <select class="form-control bulk-holder-select" style="min-width: 170px;">
            <option value="">-- Choose Holder --</option>
            ${state.holders.map(h => `<option value="${h.id}">${h.name} (${h.policy_number})</option>`).join('')}
          </select>
        </td>
        <td>
          <select class="form-control bulk-method-select">
            <option value="UPI">UPI</option>
            <option value="Bank Transfer">NEFT / RTGS</option>
            <option value="Cheque">Cheque</option>
            <option value="Cash">Cash</option>
          </select>
        </td>
        <td>
          <input type="number" class="form-control bulk-amount-input" placeholder="0" min="100" style="width: 120px;">
        </td>
        <td>
          <input type="text" class="form-control bulk-ref-input" placeholder="Batch UTR / Chq #" style="width: 130px;">
        </td>
        <td>
          <button type="button" class="btn btn-outline btn-sm text-danger btn-remove-bulk-row" title="Remove Row">
            <i class="fa-solid fa-trash"></i>
          </button>
        </td>
      `;

      tr.querySelector('.bulk-holder-select').addEventListener('change', (e) => {
        const hid = e.target.value;
        const h = state.holders.find(x => x.id === parseInt(hid, 10));
        if (h) {
          tr.querySelector('.bulk-amount-input').value = h.premium_amount;
          updateBulkTotal();
        }
      });

      tr.querySelector('.bulk-amount-input').addEventListener('input', updateBulkTotal);

      tr.querySelector('.btn-remove-bulk-row').addEventListener('click', () => {
        if (tbody.children.length > 1) {
          tr.remove();
          updateBulkTotal();
        }
      });

      tbody.appendChild(tr);
    }

    function updateBulkTotal() {
      let sum = 0;
      tbody?.querySelectorAll('.bulk-amount-input').forEach(inp => {
        sum += parseFloat(inp.value) || 0;
      });
      if (totalDisplay) totalDisplay.textContent = formatINR(sum);
    }

    document.getElementById('btn-process-bulk-payments')?.addEventListener('click', () => {
      processBulkBatch();
    });

    function processBulkBatch() {
      const rows = tbody.querySelectorAll('tr');
      let count = 0;
      let totalCollected = 0;
      const todayStr = new Date().toISOString().split('T')[0];

      rows.forEach(tr => {
        const hid = parseInt(tr.querySelector('.bulk-holder-select')?.value, 10);
        const method = tr.querySelector('.bulk-method-select')?.value || 'UPI';
        const amount = parseFloat(tr.querySelector('.bulk-amount-input')?.value) || 0;
        const ref = tr.querySelector('.bulk-ref-input')?.value.trim() || `BATCH-${Date.now().toString().slice(-6)}`;

        if (hid && amount > 0) {
          const holder = state.holders.find(h => h.id === hid);
          if (holder) {
            count++;
            totalCollected += amount;
            const nextRcptNum = state.receipts.length + 1;
            const receiptNo = `RCP-2026-${String(nextRcptNum).padStart(3, '0')}`;
            const paymentId = (state.payments.reduce((max, p) => Math.max(max, p.id), 0) || 0) + 1;

            state.payments.push({
              id: paymentId,
              holder_id: hid,
              amount,
              late_fee: 0,
              total_amount: amount,
              due_date: holder.next_due_date,
              paid_date: todayStr,
              status: "Paid",
              payment_method: method,
              reference_no: ref,
              receipt_no: receiptNo,
              collector: `Bulk Batch (${state.currentUser.name})`,
              notes: `Corporate batch collection clearing`
            });

            state.receipts.push({
              id: nextRcptNum,
              payment_id: paymentId,
              receipt_no: receiptNo,
              date: todayStr,
              time: "Batch Entry",
              holder_id: holder.id,
              holder_name: holder.name,
              policy_no: holder.policy_number,
              plan_name: holder.plan_name,
              amount: amount,
              late_fee: 0,
              total_amount: amount,
              payment_method: method,
              reference_no: ref,
              collector: `Batch (${state.currentUser.name})`,
              period_desc: `Batch Installment Clearing (${holder.payment_frequency})`
            });

            // Advance due date
            const curDue = new Date(holder.next_due_date);
            if (holder.payment_frequency === 'Yearly') curDue.setFullYear(curDue.getFullYear() + 1);
            else if (holder.payment_frequency === 'Half-Yearly') curDue.setMonth(curDue.getMonth() + 6);
            else if (holder.payment_frequency === 'Quarterly') curDue.setMonth(curDue.getMonth() + 3);
            else curDue.setMonth(curDue.getMonth() + 1);
            holder.next_due_date = curDue.toISOString().split('T')[0];
          }
        }
      });

      if (count > 0) {
        state.reconciliation.unshift({
          id: (state.reconciliation.reduce((max, r) => Math.max(max, r.id), 0) || 0) + 1,
          date: todayStr,
          channel: "Batch Collections",
          expected: totalCollected,
          actual: totalCollected,
          variance: 0,
          status: "Reconciled",
          reconciled_by: `${state.currentUser.name} (Batch Operator)`,
          notes: `Batch collection for ${count} policies processed`
        });

        persistAll();
        closeModal('modal-bulk-payment');
        updateDashboard();
        showToast('Batch Processed', `Successfully cleared ${count} policies totaling ${formatINR(totalCollected)}!`, 'success');
      } else {
        showToast('Warning', 'Please enter at least one valid row with holder and amount.', 'warning');
      }
    }
  }

  // =========================================================================
  // 15. CSV Export Helper
  // =========================================================================
  function downloadCSV(filename, rows) {
    const csvContent = "data:text/csv;charset=utf-8," + rows.map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // =========================================================================
  // 16. Modal Dialog Generic Controls
  // =========================================================================
  function openModal(modalId) {
    if (!modalId) return;
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('hidden');
      modal.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    }
  }

  function closeModal(modalId) {
    if (!modalId) return;
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('hidden');
      modal.style.display = 'none';
      document.body.style.overflow = '';
    }
  }

  function initModals() {
    // 1. Direct click listeners on buttons with data-close-modal or modal-close-btn
    document.querySelectorAll('[data-close-modal], .modal-close-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const targetId = btn.dataset?.closeModal || btn.getAttribute('data-close-modal') || btn.closest('.modal-overlay')?.id;
        if (targetId) {
          closeModal(targetId);
        }
      });
    });

    // 2. Global delegated click handler (safeguards dynamic rendering or clicks on child text/icons)
    document.addEventListener('click', (e) => {
      const closeBtn = e.target.closest('[data-close-modal], .modal-close-btn');
      if (closeBtn) {
        e.preventDefault();
        e.stopPropagation();
        const targetId = closeBtn.dataset?.closeModal || closeBtn.getAttribute('data-close-modal') || closeBtn.closest('.modal-overlay')?.id;
        if (targetId) {
          closeModal(targetId);
        }
        return;
      }

      // Backdrop overlay click
      if (e.target.classList && e.target.classList.contains('modal-overlay')) {
        closeModal(e.target.id);
      }
    });

    // 3. Escape key to close any active modal
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        document.querySelectorAll('.modal-overlay:not(.hidden)').forEach(modal => {
          closeModal(modal.id);
        });
      }
    });
  }

  // =========================================================================
  // 17. Reset Sample Data
  // =========================================================================
  function initResetSampleData() {
    document.getElementById('reset-sample-data-btn')?.addEventListener('click', () => {
      if (confirm("Reset application data back to 2,006 policyholders (Amit Sharma, Priya Patel, etc.) and accounts?")) {
        safeStorage.removeItem(STORAGE_KEYS.USERS);
        safeStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
        safeStorage.removeItem(STORAGE_KEYS.HOLDERS);
        safeStorage.removeItem(STORAGE_KEYS.PAYMENTS);
        safeStorage.removeItem(STORAGE_KEYS.INSTALLMENTS);
        safeStorage.removeItem(STORAGE_KEYS.RECEIPTS);
        safeStorage.removeItem(STORAGE_KEYS.RECONCILIATION);
        safeStorage.removeItem(STORAGE_KEYS.NOTIFICATIONS);
        location.reload();
      }
    });
  }

  // =========================================================================
  // 18. Application Bootstrapping
  // =========================================================================
  function initApp() {
    initClock();
    initTheme();
    initAuth();
    initNotifications();
    initQuickSearch();
    initNavigation();
    initHolderFilters();
    initPaymentForm();
    initInstallmentFilters();
    initDueDateFilters();
    initReceiptActions();
    initHistoryFilters();
    initReconciliationActions();
    initReportActions();
    initBulkPaymentModal();
    initModals();
    initResetSampleData();

    // Initial render
    updateDashboard();
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }

})();
