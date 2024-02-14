//Priorities are 1,2,3, and 4 (highest to lowest)
/*Requirements of 
priority 1 are mandatory for the first implementation; 
priority 2 are mandatory for the final implementation; 
priority 3 is used for optional features that the client would like to have; 
priority 4 is used for optional features.*/
const req1 = [{
    "Requirement Identifier" : "REQ005",
    "Requirement Text" : "login",
    "Requirement Relationship" : 1,
    "Dependencies": ['OR', "REQ001", ['AND', "REQ002","REQ003"],"REQ004"],
    "Module" : "from processing",
    "Priority" : 1,
    "Risk" : "Critical",
  },
  {
    "Requirement Identifier" : "REQ001",
    "Requirement Text" : "sign up",
    "Requirement Relationship" : 0,
    "Dependencies": [],
    "Module" : "",
    "Priority" : 3,
    "Risk" : "Low",
  },
  {
    "Requirement Identifier" : "REQ002",
    "Requirement Text" : "username",
    "Requirement Relationship" : 0,
    "Dependencies": [],
    "Module" : "login",
    "Priority" : 2,
    "Risk" : "Low",
  },
  {
    "Requirement Identifier" : "REQ003",
    "Requirement Text" : "password",
    "Requirement Relationship" : 0,
    "Dependencies": [],
    "Module" : "login",
    "Priority" : 2,
    "Risk" : "Low",
  },
  {
    "Requirement Identifier" : "REQ004",
    "Requirement Text" : "Loing with Google",
    "Requirement Relationship" : 0,
    "Dependencies": [],
    "Module" : "",
    "Priority" : 4,
    "Risk" : "Low",
  },]

const req2 = [
  {
    "Requirement Identifier": "REQ101",
    "Requirement Text": "User profile creation",
    "Requirement Relationship": 1,
    "Dependencies": ["REQ102", "REQ103"],
    "Module": "User Management",
    "Priority": 2,
    "Risk": "Low"
  },
  {
    "Requirement Identifier": "REQ102",
    "Requirement Text": "User registration",
    "Requirement Relationship": 0,
    "Dependencies": [],
    "Module": "Authentication",
    "Priority": 3,
    "Risk": "Medium"
  },
  {
    "Requirement Identifier": "REQ103",
    "Requirement Text": "User authentication",
    "Requirement Relationship": 0,
    "Dependencies": [],
    "Module": "Authentication",
    "Priority": 2,
    "Risk": "Low"
  },
  {
    "Requirement Identifier": "REQ104",
    "Requirement Text": "User profile editing",
    "Requirement Relationship": 1,
    "Dependencies": ["REQ101"],
    "Module": "User Management",
    "Priority": 4,
    "Risk": "Medium"
  },
  {
    "Requirement Identifier": "REQ105",
    "Requirement Text": "Admin role creation",
    "Requirement Relationship": 0,
    "Dependencies": [],
    "Module": "User Management",
    "Priority": 3,
    "Risk": "High"
  }
]
const req3=[
  {
    "Requirement Identifier": "REQ001",
    "Requirement Text": "The system shall authenticate users based on their username and password.",
    "Requirement Relationship": "NO",
    "Dependencies": [],
    "Module": "User Management",
    "Priority": 3,
    "Risk": "High"
  },
  {
    "Requirement Identifier": "REQ002",
    "Requirement Text": "The system shall allow users to reset their passwords if they forget them.",
    "Requirement Relationship": "NO",
    "Dependencies": [],
    "Module": "User Management",
    "Priority": 2,
    "Risk": "High"
  },
  {
    "Requirement Identifier": "REQ003",
    "Requirement Text": "The system shall store user preferences for customization purposes.",
    "Requirement Relationship": "NO",
    "Dependencies": [],
    "Module": "User Preferences",
    "Priority": 1,
    "Risk": "Medium"
  },
  {
    "Requirement Identifier": "REQ004",
    "Requirement Text": "The system shall store the form data if the user selects ”Save” AND all mandatory fields are filled.",
    "Requirement Relationship": "YES",
    "Dependencies": ["AND","REQ001","REQ003"],
    "Module": "Form Processing",
    "Priority": 4,
    "Risk": "High"
  },
  {
    "Requirement Identifier": "REQ005",
    "Requirement Text": "If the user selects ”Cancel” OR the form has not been modified, the system shall discard the form data.",
    "Requirement Relationship": "YES",
    "Dependencies": ["OR","REQ004","REQ006"],
    "Module": "Form Processing",
    "Priority": 3,
    "Risk": "Low"
  },
  {
    "Requirement Identifier": "REQ006",
    "Requirement Text": "The system shall generate reports based on user-specified criteria.",
    "Requirement Relationship": "NO",
    "Dependencies": [],
    "Module": "Reporting",
    "Priority": 3,
    "Risk": "Medium"
  },
  {
    "Requirement Identifier": "REQ007",
    "Requirement Text": "The system shall validate credit card information before processing payments.",
    "Requirement Relationship": "NO",
    "Dependencies": [],
    "Module": "Payment Processing",
    "Priority": 2,
    "Risk": "High"
  },
  {
    "Requirement Identifier": "REQ008",
    "Requirement Text": "If the payment is successful, the system shall update the order status to ”Paid.”",
    "Requirement Relationship": "YES",
    "Dependencies": ["REQ007"],
    "Module": "Order Management",
    "Priority": 1,
    "Risk": "Medium"
  },
  {
    "Requirement Identifier": "REQ009",
    "Requirement Text": "The system shall track inventory levels and generate alerts when stock is low.",
    "Requirement Relationship": "NO",
    "Dependencies": [],
    "Module": "Inventory Management",
    "Priority": 4,
    "Risk": "High"
  },
  {
    "Requirement Identifier": "REQ010",
    "Requirement Text": "The system shall generate invoices and please send them to customers after successful purchases.",
    "Requirement Relationship": "NO",
    "Dependencies": [],
    "Module": "Billing",
    "Priority": 4,
    "Risk": "Medium"
  },
]
  
  export {req1, req3};
  // module.exports = requirements;