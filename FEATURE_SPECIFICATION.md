# BhortiJuddho: Feature Specification & Database Mapping

This document details every feature in the BhortiJuddho application and maps it to the corresponding database tables and queries.

## 1. Student Profile Management

**Feature Description:**
Allows students to manage their personal information. This is the "Master Data" that is reused across multiple applications.

**Database Table:** `profiles`

**Operations & Queries:**
*   **Get Profile:** Fetches the student's personal details.
    *   **Query:** `SELECT * FROM profiles WHERE id = [userId]`
    *   **Service:** `studentService.getProfile`
*   **Update Profile:** Updates or creates the student's profile (Upsert).
    *   **Query:** `UPSERT INTO profiles (id, [fields]) VALUES ([userId], ...)`
    *   **Service:** `studentService.updateProfile`
*   **Admin View:** Admins can view all student profiles.
    *   **Query:** `SELECT * FROM profiles`
    *   **Service:** `adminService.getAllStudents`
*   **Admin Delete:** Admins can delete a student.
    *   **Query:** `DELETE FROM profiles WHERE id = [studentId]`
    *   **Service:** `adminService.deleteStudent`

---

## 2. Academic Records

**Feature Description:**
Allows students to input their academic history (SSC, HSC, GPA, Passing Year). This data is part of the "Master Data".

**Database Table:** `academic_records`

**Operations & Queries:**
*   **Get Records:** Fetches all academic records for a specific student.
    *   **Query:** `SELECT * FROM academic_records WHERE student_id = [userId]`
    *   **Service:** `studentService.getAcademicRecords`
*   **Add Record:** Adds a new academic qualification.
    *   **Query:** `INSERT INTO academic_records (student_id, ...) VALUES (...)`
    *   **Service:** `studentService.addAcademicRecord`
*   **Update Record:** Updates an existing academic record.
    *   **Query:** `UPDATE academic_records SET [fields] WHERE id = [id]`
    *   **Service:** `studentService.updateAcademicRecord`
*   **Delete Record:** Removes an academic record.
    *   **Query:** `DELETE FROM academic_records WHERE id = [id]`
    *   **Service:** `studentService.deleteAcademicRecord`

---

## 3. Document Management

**Feature Description:**
Centralized repository for uploading and managing supporting documents (Transcripts, Photos, Signatures).

**Database Table:** `documents`
**Storage Bucket:** `documents` (or `student-documents`)

**Operations & Queries:**
*   **Upload Document:** Uploads file to Supabase Storage and saves metadata to DB.
    *   **Storage:** `supabase.storage.from('documents').upload(...)`
    *   **Query:** `INSERT INTO documents (student_id, file_name, file_type) VALUES (...)`
    *   **Service:** `studentService.uploadDocument`
*   **Get Documents:** Fetches all documents uploaded by a student.
    *   **Query:** `SELECT * FROM documents WHERE student_id = [userId]`
    *   **Service:** `studentService.getDocuments`
*   **Delete Document:** Removes the document record (and should remove file from storage).
    *   **Query:** `DELETE FROM documents WHERE id = [id]`
    *   **Service:** `studentService.deleteDocument`

---

## 4. University Management

**Feature Description:**
Manage the list of universities available for application.

**Database Table:** `universities`

**Operations & Queries:**
*   **Get All Universities:** Fetches the list of all universities for the dropdown/listing.
    *   **Query:** `SELECT * FROM universities`
    *   **Service:** `universityService.getUniversities`, `adminService.getAllUniversities`
*   **Add University (Admin):** Adds a new university to the system.
    *   **Query:** `INSERT INTO universities ([fields]) VALUES (...)`
    *   **Service:** `adminService.addUniversity`
*   **Update University (Admin):** Edits university details.
    *   **Query:** `UPDATE universities SET [fields] WHERE id = [id]`
    *   **Service:** `adminService.updateUniversity`
*   **Delete University (Admin):** Removes a university.
    *   **Query:** `DELETE FROM universities WHERE id = [id]`
    *   **Service:** `adminService.deleteUniversity`

---

## 5. Program Management

**Feature Description:**
Manage scholarship programs offered by universities. Linked to specific universities.

**Database Table:** `programs`

**Operations & Queries:**
*   **Get Programs by University:** Fetches programs for a selected university.
    *   **Query:** `SELECT * FROM programs WHERE university_id = [universityId]`
    *   **Service:** `universityService.getProgramsByUniversity`
*   **Get All Programs (Admin):** Fetches all programs across all universities.
    *   **Query:** `SELECT * FROM programs`
    *   **Service:** `adminService.getAllPrograms`
*   **Add Program (Admin):** Creates a new program.
    *   **Query:** `INSERT INTO programs ([fields]) VALUES (...)`
    *   **Service:** `adminService.addProgram`
*   **Update Program (Admin):** Edits program details.
    *   **Query:** `UPDATE programs SET [fields] WHERE id = [id]`
    *   **Service:** `adminService.updateProgram`
*   **Delete Program (Admin):** Removes a program.
    *   **Query:** `DELETE FROM programs WHERE id = [id]`
    *   **Service:** `adminService.deleteProgram`

---

## 6. Application System

**Feature Description:**
The core workflow where students apply to specific programs at universities. Links Student, University, and Program.

**Database Table:** `applications`

**Operations & Queries:**
*   **Get Student Applications:** View all applications made by a student, including associated essays.
    *   **Query:** `SELECT *, essays(*) FROM applications WHERE student_id = [userId]`
    *   **Service:** `studentService.getApplications`
*   **Get All Applications (Admin):** Admin view of all applications.
    *   **Query:** `SELECT *, essays(*) FROM applications`
    *   **Service:** `adminService.getAllApplications`
*   **Create Application:** Submits a new application.
    *   **Query:** `INSERT INTO applications ([fields]) VALUES (...)`
    *   **Service:** `studentService.createApplication`
*   **Update Application:** Updates application details (e.g., status).
    *   **Query:** `UPDATE applications SET [fields] WHERE id = [id]`
    *   **Service:** `studentService.updateApplication`
*   **Update Status (Admin):** Admin changes status (e.g., Accepted/Rejected).
    *   **Query:** `UPDATE applications SET status = [status] WHERE id = [id]`
    *   **Service:** `adminService.updateApplicationStatus`
*   **Delete Application:** Withdraws/deletes an application.
    *   **Query:** `DELETE FROM applications WHERE id = [id]`
    *   **Service:** `studentService.deleteApplication`

---

## 7. Essay Management

**Feature Description:**
Students write and manage essays specifically linked to their applications.

**Database Table:** `essays`

**Operations & Queries:**
*   **Get Essays:** Fetches essays for a specific application.
    *   **Query:** `SELECT * FROM essays WHERE application_id = [applicationId]`
    *   **Service:** `studentService.getEssays`
*   **Add Essay:** Saves a new essay.
    *   **Query:** `INSERT INTO essays ([fields]) VALUES (...)`
    *   **Service:** `studentService.addEssay`
*   **Update Essay:** Edits an existing essay.
    *   **Query:** `UPDATE essays SET [fields] WHERE id = [id]`
    *   **Service:** `studentService.updateEssay`
*   **Delete Essay:** Removes an essay.
    *   **Query:** `DELETE FROM essays WHERE id = [id]`
    *   **Service:** `studentService.deleteEssay`
