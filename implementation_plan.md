# BhortiJuddho: Limited Common App Clone Integration Plan

## 1. Project Overview
**Goal**: Create a limited clone of the Common Application ("Common App") tailored for the Bangladeshi context (BhortiJuddho).
**Core Philosophy**: A centralized platform where students create a single profile (Master Data) and use it to apply to multiple universities/programs without re-entering redundant information.

> **Note**: For a detailed list of features mapped to database queries, please see [FEATURE_SPECIFICATION.md](./FEATURE_SPECIFICATION.md).

## 2. Current vs. Target Architecture

### 2.1 Mismatches Identified
| Feature | Current Implementation | Target Schema Requirement | Action Required |
| :--- | :--- | :--- | :--- |
| **User Profile** | `profiles` table (Updated) | `profiles` table (schema matches) | ✅ Aligned (Service uses upsert) |
| **University Selection** | User types string manually | `universities` table (Dropdown selection) | **MAJOR CHANGE**: Fetch from DB |
| **Program Selection** | User types string manually | `programs` table (Dropdown, linked to Uni) | **MAJOR CHANGE**: Fetch from DB |
| **Applications** | Stores strings (`university`, `program`) | Stores FKs (`university_id`, `program_id`) | Update `createApplication` logic |
| **Essays** | Basic CRUD | Linked to `application_id` | ✅ Aligned in Service |

### 2.2 Folder Structure Strategy
Your current structure is clean and effective. We will enhance it slightly to support the new features.

```
src/
├── components/       # Reusable UI (Navbar, Loading, etc.)
├── context/         # AuthContext (User session)
├── pages/
│   ├── Auth/        # Login, Signup
│   ├── Student/     # CLONE CORE FEATURES:
│   │   ├── Dashboard.jsx      # status overview
│   │   ├── Profile.jsx        # "Common App" Profile (Master Data)
│   │   ├── AcademicInfo.jsx   # Grades/Transcripts (Master Data)
│   │   ├── Documents.jsx      # Uploads (Master Data)
│   │   ├── Applications.jsx   # The "My Colleges" tab equivalent
│   │   └── Essays.jsx         # Supplemental writing
├── services/
│   ├── authService.js
│   ├── studentService.js
│   └── universityService.js   # [NEW] Needed to fetch Uni/Programs
```

## 3. Detailed Feature Roadmap

### Phase 1: The "Master Data" Layer (Completed ✅)
This layer collects data ONCE to be sent everywhere.
*   **Profile**: Personal details, Address, Phone. (Implemented)
*   **Academic Info**: SSC/HSC results, GPA, Passing Year. (Implemented)
*   **Documents**: centralized repository for Transcripts, Photos, Signatures. (Implemented)
    
#### Pending Refinements (Identified during review):
*   **Profile**: `Profile.jsx` allows editing text, but **Avatar Upload** is not implemented.
*   **Academic Info**: `AcademicInfo.jsx` is currently **Read-Only**. Needs to be editable.

### Phase 2: The "University Data" Layer (Ready to Execute 🚀)
We need to populate the database with real/sample university data so students can *choose* them instead of typing them.

**Action Required:**
Run the SQL script `POPULATE_DATA.sql` in your Supabase SQL Editor.
> **Note**: The script handles schema standardization (renaming `program_name` to `name` if necessary) to match the project's consistent naming convention.

**New Service: `universityService.js`**
```javascript
export async function getUniversities() {
  return await supabase.from('universities').select('*');
}

export async function getPrograms(universityId) {
  return await supabase.from('programs').select('*').eq('university_id', universityId);
}
```

### Phase 3: The Application Workflow (Modifications Needed 🔧)
Transform `Applications.jsx` from a text-entry form to a selection wizard:
1.  **Select University**: Dropdown fetching from `universities` table.
2.  **Select Program**: Dropdown fetching from `programs` table (filtered by selected Uni).
3.  **Review Requirements**: Show `requirements` text from the `programs` table.
4.  **Submit**: Insert record into `applications` table using IDs (`university_id`, `program_id`).

### Phase 4: Essay Management
*   Link essays specifically to the `application_id` (already in schema).
*   Add prompts (e.g., "Why do you want to study CS at Dhaka University?") referenced from the `programs` table.

## 4. Database Schema Integration Rules

To match your provided SQL schema, ensure the following logic in your Frontend:

**1. Applications Creation:**
Instead of sending `{ university: "DU", program: "CS" }`, send:
```json
{
  "student_id": "uuid...",
  "university_id": 1,
  "program_id": 5,
  "status": "Submitted"
}
```

**2. Viewing Applications:**
When fetching applications, you must **JOIN** tables to get names:
```javascript
supabase
  .from('applications')
  .select('*, universities(name), programs(name)')
```

## 5. Next Immediate Steps for you
1.  **Run the provided SQL** in your Supabase SQL Editor to create the `universities`, `programs`, and modified `applications` tables.
2.  **Insert Sample Data** (at least 3 universities and 5 programs) so the dropdowns aren't empty.
3.  **Ask me to:** "Refactor Applications page to use dropdowns for Universities and Programs" - I will then create the new service and update the UI.
