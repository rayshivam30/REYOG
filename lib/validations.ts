import { z } from "zod"
import { UserRole, QueryStatus, ComplaintStatus } from "@prisma/client"

// Auth schemas
export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phone: z.string().optional(),
  panchayatId: z.string().min(1, "Please select a Panchayat"),
  wardNumber: z.number().int().min(1, "Ward number must be a positive integer"),
})

// Query schemas
export const createQuerySchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters long."),
  description: z.string().min(10, "Description must be at least 10 characters"),

  // --- CHANGE IS HERE ---
  // REMOVED: The old 'panchayatName' input field validation.
  // panchayatName: z.string().min(3, "Panchayat name must be at least 3 characters.").max(100),
  
  // ADDED: The new 'panchayatId' validation for the dropdown selector.
  panchayatId: z.string().min(1, "Please select a Panchayat from the list."),
  
  wardNumber: z.number().int().min(1, "Ward number must be a positive integer"),
  
  departmentId: z.string().optional(),
  officeId: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  attachments: z
    .array(
      z.object({
        filename: z.string(),
        url: z.string().url(),
        size: z.number(),
        type: z.string(),
      })
    )
    .optional(),
});

export const updateQuerySchema = z.object({
  status: z.nativeEnum(QueryStatus).optional(),
  budgetIssued: z.number().positive().optional(),
  budgetSpent: z.number().min(0).optional(),
  officialIncharge: z.string().optional(),
  teamAssigned: z.string().optional(),
  estimatedStart: z.string().datetime().optional(),
  estimatedEnd: z.string().datetime().optional(),
})

export const queryUpdateSchema = z.object({
  status: z.nativeEnum(QueryStatus).optional(),
  note: z.string().optional(),
  budgetSpentDelta: z.number().optional(),
  attachments: z.array(z.string()).default([]),
})

// Complaint schemas
export const createComplaintSchema = z.object({
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  attachments: z.array(z.string()).default([]),
  queryId: z.string().optional(),
})

export const updateComplaintSchema = z.object({
  status: z.nativeEnum(ComplaintStatus),
  resolution: z.string().optional(),
})

export const complaintUpdateSchema = z.object({
  status: z.nativeEnum(ComplaintStatus),
  resolutionNote: z.string().optional(),
})

// Rating schema
export const createRatingSchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string().optional(),
  officeId: z.string(),
})

// Office schema
export const createOfficeSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  latitude: z.number(),
  longitude: z.number(),
  contactPhone: z.string().optional(),
  contactEmail: z.string().email().optional(),
  workingHours: z.string().optional(),
  departmentId: z.string(),
  panchayatId: z.string(),
})

// User creation schema (for admin)
export const createUserSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phone: z.string().optional(),
  role: z.nativeEnum(UserRole),
  panchayatId: z.string().optional(),
})

// User update schema
export const updateUserSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
  email: z.string().email("Invalid email address").optional(),
  phone: z.string().optional(),
  panchayatId: z.string().min(1, "Please select a Panchayat").optional(),
  wardNumber: z.number().int().min(1, "Ward number must be a positive integer").optional(),
})

// NGO schema
export const createNGOSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  focusArea: z.string().min(2, "Focus area is required"),
  coverage: z.string().min(2, "Coverage area is required"),
  contactName: z.string().min(2, "Contact name is required"),
  contactEmail: z.string().email("Invalid email address"),
  contactPhone: z.string().min(10, "Valid phone number is required"),
  address: z.string().optional(),
  website: z.string().url().optional(),
})

export const ngoSchema = createNGOSchema

// Service stat schema
export const serviceStatSchema = z.object({
  category: z.string().min(2, "Category is required"),
  metric: z.string().min(2, "Metric is required"),
  value: z.number().min(0, "Value must be non-negative"),
  unit: z.string().optional(),
})