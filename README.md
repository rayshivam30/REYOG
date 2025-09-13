# REYOG - Rural Engagement & Youth Oriented Governance

[![Live Demo](https://img.shields.io/badge/View-Live%20Demo-brightgreen)](https://reyog.vercel.app/)

REYOG is a Next.js-based web application designed to facilitate better governance and public service delivery in rural areas by enabling citizens to submit queries, track complaints, and rate government services.

> 🌐 **Live Demo**: [https://reyog.vercel.app/](https://reyog.vercel.app/)

## Features

-  **User Authentication**: Secure, role-based access control for Voters, Officers, and Admins.
-   **Query & Complaint Management**: Citizens can submit, track, and update service requests and complaints.
-   **File Uploads**: Attach relevant documents and images to queries, integrated with Cloudinary for storage.
-   **Panchayat & NGO Directory**: A comprehensive directory to search and view details of local government offices and NGOs.
-   **Rating & Feedback System**: A transparent system for citizens to rate government services and offices.
-   **Real-time Notifications**: Keep users updated on the status of their queries and other important events.
-   **Location Services**: Google Maps integration to display office locations and map query-related sites.
-   **Admin Dashboard**: A powerful interface for admins to manage users, content, complaints, and platform statistics.


## Tech Stack

-  **Framework**: Next.js 13+ (App Router, React, TypeScript)
-   **Database**: PostgreSQL with Prisma ORM
-   **Authentication**: NextAuth.js
-   **UI/Styling**: Tailwind CSS with shadcn/ui & Radix UI components, Lucide Icons
-   **State Management**: React Query
-   **Form Handling**: React Hook Form with Zod for validation
-   **File Storage**: Cloudinary
-   **API**: Next.js API Routes
-   **Package Manager**: pnpm
## Prerequisites

- Node.js 18.x or later
- PostgreSQL database
- Google Maps API key (for location services)
- Environment variables (see `.env.example`)

## Getting Started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd REYOG
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Copy `.env.example` to `.env` and update the values:
   ```env
   DATABASE_URL=postgresql://user:password@host:port/dbname
   JWT_SECRET=your-secret-key
   JWT_REFRESH_SECRET=your-refresh-secret
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloudinary-name
   CLOUDINARY_API_SECRET=your-cloudinary-api-secret
   NEXT_PUBLIC_CLOUDINARY_API_KEY=your-cloudinary-api
   NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your cloudnary preset name
   ```

4. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma db push
   npx prisma db seed
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Create production build
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npx prisma studio` - Database GUI (runs on http://localhost:5555)

## Project Structure

```
REYOG/
├── app/                    # Next.js app directory
│   ├── api/                # API routes
│   ├── auth/               # Authentication pages
│   ├── dashboard/          # Main application dashboard
│   └── ...
├── components/             # Reusable UI components
│   ├── admin/              # Admin-specific components
│   ├── auth/               # Authentication components
│   └── ...
├── prisma/                 # Database schema and migrations
│   ├── schema.prisma       # Prisma schema
│   └── seed.ts             # Database seed data
└── public/                 # Static assets
```

## Database Schema

Key models include:
- **User**: System users with roles (Voter, Admin, Officer)
- **Panchayat**: Local government units
- **Department**: Government departments
- **Office**: Physical office locations
- **Query**: Citizen service requests
- **Rating**: Service ratings and feedback

## Deployment

### Prerequisites
- Vercel account (or preferred hosting provider)
- PostgreSQL database (e.g., Supabase, Railway, or self-hosted)

### Steps
1. Push your code to a Git repository
2. Import the repository to Vercel
3. Set up environment variables in Vercel
4. Deploy!

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

For support or questions, please contact the development team.
