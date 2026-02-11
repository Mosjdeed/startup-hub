# Startup Hub

**Startup Incubator Management System built on Frappe Framework**

![Startup Hub Landing Page](screenshots/landing.png)

## 📋 Description

A comprehensive management system for startup incubators and accelerators, featuring:

-  **Startup Management** - Track startups from idea to growth
-  **Founder Profiles** - Manage founder information
-  **Mentor Assignment** - Connect startups with mentors
-  **Funding Rounds** - Track investments and equity
-  **Milestones** - Monitor startup progress
-  **Meetings** - Schedule mentorship sessions

## ✨ Features

### 🔧 Technical Features
- **7 Custom DocTypes** with relationships
- **Server-Side Scripting** - Auto-calculate total funding
- **Client-Side Scripting** - Dynamic UI interactions
- **Auto-Generated Milestones** - When funding is received
- **Print Formats** - Professional PDF exports
- **Custom Reports** - Funding analytics
- **Web Forms** - Public startup application
- **Custom Landing Page** - Modern UI design

### 📊 DocTypes
| DocType | Description |
|---------|-------------|
| Startup | Main startup information |
| Founder | Startup founders |
| Mentor | Mentors and advisors |
| Investor | Investment partners |
| Funding Round | Investment tracking |
| Meeting | Mentorship sessions |
| Milestone | Progress tracking |

## 🛠️ Installation

```bash
cd ~/frappe-bench
bench get-app https://github.com/YOUR_USERNAME/startup-hub.git
bench --site your-site install-app startup_hub
bench migratestartup_hub/
```
## 📁 Project Structure
├── startup_hub/
│   ├── doctype/
│   │   ├── startup/
│   │   ├── founder/
│   │   ├── mentor/
│   │   ├── investor/
│   │   ├── funding_round/
│   │   ├── meeting/
│   │   └── milestone/
│   ├── print_format/
│   ├── report/
│   ├── workspace/
│   └── www/
│       └── startup-hub/

## Key Technical Implementations
### Server-Side: Auto-Calculate Funding
```
def update_startup_funding(self):
    total = frappe.db.sql("""
        SELECT SUM(amount) as total, COUNT(*) as count
        FROM `tabFunding Round`
        WHERE startup = %s AND status = 'Completed'
    """, self.startup, as_dict=True)[0]
    
    frappe.db.set_value('Startup', self.startup, {
        'total_funding': total.total or 0,
        'funding_rounds_count': total.count or 0
    })
```
### Auto-Create Milestone on First Funding
```
def create_funding_milestone(self):
    if self.status == 'Completed':
        milestone = frappe.new_doc('Milestone')
        milestone.startup = self.startup
        milestone.title = f'First Funding - {self.round_type}'
        milestone.insert()
```

## 📄 License
MIT License
