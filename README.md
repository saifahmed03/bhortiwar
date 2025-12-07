# BhortiJuddho - University Application Management System

A modern, user-friendly scholarship application management platform built with React and Supabase.
## 🌟 Features

### For Students
- **User Authentication** - Secure login/signup with email or Google OAuth
- **Profile Management** - Complete profile with personal and academic information
- **Application System** - Create and manage scholarship applications
- **Essay Writing** - Built-in essay editor for application essays
- **Document Upload** - Upload and manage supporting documents
- **Application Tracking** - Track application status in real-time

### For Administrators
- **Dashboard Analytics** - Overview of students, universities, programs, and applications
- **Student Management** - View and manage student accounts
- **University Management** - Add, edit, and delete universities
- **Program Management** - Add, edit, and delete scholarship programs
- **Application Review** - View and update application statuses
- **Status Management** - Update applications through Draft → Submitted → In Review → Accepted/Rejected

## 🚀 Tech Stack

- **Frontend**: React 18.2.0
- **Routing**: React Router DOM 6.15.0
- **UI Framework**: Bootstrap 5.3.2 + React Bootstrap 2.8.0
- **Animations**: Framer Motion 12.23.25
- **Notifications**: React Toastify 9.1.3
- **Backend**: Supabase (Auth, Database, Storage)
- **Build Tool**: Create React App 5.0.1

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Supabase account

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd bhortijuddho
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Create a `.env.local` file in the root directory with the following:
   ```env
   REACT_APP_SUPABASE_URL=your_supabase_url
   REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
   REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id
   REACT_APP_GOOGLE_CLIENT_SECRET=your_google_client_secret
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

   The app will open at [http://localhost:3000](http://localhost:3000)

## 📦 Available Scripts

- `npm start` - Run the development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App (one-way operation)

## 🗂️ Project Structure

```
bhortijuddho/
├── public/               # Static files
├── src/
│   ├── components/       # Reusable components
│   │   ├── AdminProtected.jsx
│   │   ├── Footer.jsx
│   │   ├── Layout.jsx
│   │   ├── Loading.jsx
│   │   ├── Navbar.jsx
│   │   └── ProtectedRoute.jsx
│   ├── context/          # React Context providers
│   │   ├── AdminContext.js
│   │   └── AuthContext.js
│   ├── pages/            # Page components
│   │   ├── Admin/
│   │   ├── Auth/
│   │   ├── Error/
│   │   ├── Home/
│   │   └── Student/
│   ├── services/         # API service functions
│   │   ├── adminService.js
│   │   ├── applicationService.js
│   │   ├── authService.js
│   │   ├── fileService.js
│   │   ├── studentService.js
│   │   └── universityService.js
│   ├── styles/           # CSS stylesheets
│   ├── utils/            # Utility functions
│   │   ├── notification.js
│   │   ├── pdfGenerator.js
│   │   └── validators.js
│   ├── App.js            # Main App component
│   ├── index.js          # Entry point
│   ├── routes.js         # Route configuration
│   └── supabaseClient.js # Supabase client setup
├── .env.local            # Environment variables
├── package.json          # Dependencies
└── README.md             # This file
```

## 🗄️ Database Schema

### Tables
- **profiles** - Student profile information
- **universities** - University listings
- **programs** - Scholarship program details
- **applications** - Student applications
- **essays** - Application essays
- **documents** - Uploaded documents

## 🔐 Authentication

The application supports:
- Email/Password authentication
- Google OAuth integration
- Protected routes for authenticated users
- Role-based access control (Student/Admin)

## 🎨 UI Features

- Responsive design for all devices
- Modern, clean interface
- Dark theme support
- Smooth animations with Framer Motion
- Toast notifications for user feedback
- Loading states and error handling

## 📱 Routes

### Public Routes
- `/` - Home page
- `/auth/login` - Login page
- `/auth/signup` - Signup page

### Protected Student Routes
- `/student/dashboard` - Student dashboard
- `/student/profile` - Profile management
- `/student/academic-info` - Academic information
- `/student/applications` - Application list
- `/student/essays` - Essay editor
- `/student/documents` - Document manager

### Protected Admin Routes
- `/admin` - Admin panel

## 🧪 Testing

Run tests with:
```bash
npm test
```

## 🏗️ Building for Production

Create a production build:
```bash
npm run build
```

The build folder will contain optimized files ready for deployment.

## 🚀 Deployment

The application can be deployed to:
- Vercel
- Netlify
- AWS Amplify
- GitHub Pages
- Any static hosting service

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 👥 Authors

- Your Team Name

## 🙏 Acknowledgments

- React team for the amazing framework
- Supabase team for the backend infrastructure
- Bootstrap team for the UI components
- All contributors and testers

## 📧 Support

For support, email saif.ahmed03@northsouth.edu or create an issue in the repository.

## 🐛 Known Issues

See the [Issues](issues) section for known bugs and feature requests.

## 🔄 Changelog

### Version 1.0.0 (Current)
- Initial release
- User authentication and authorization
- Student profile and application management
- Admin panel for managing universities and programs
- Essay writing and document upload functionality
- Application status tracking

---

Made with ❤️ by the BhortiJuddho Team
