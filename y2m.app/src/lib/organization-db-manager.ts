import { Pool } from 'pg';

const defaultFeatures = [
  'Skill Assessment',
  'Mentor Marketplace',
  'Video Call',
  'Discussion Forum',
  'AI Chatbot',
  'Development Hub',
  'My SKills',
  'Enterprise Solution',
];

interface DatabaseError extends Error {
  code?: string;
}

export async function createOrganizationDatabase(
  organizationName: string,
  domain: string,
  subdomain: string,
  contactEmail: string // Now used in the insert statement
): Promise<string> {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });

  const dbName = `organization_${organizationName.toLowerCase().replace(/\s+/g, '_')}`;
  const organizationDbUrl = `postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@localhost:${process.env.DB_PORT}/${dbName}`;

  try {
    // Check if the organization already exists
    const existingOrganization = await pool.query(
      'SELECT * FROM "Organization" WHERE domain = $1 OR subdomain = $2',
      [domain, subdomain]
    );

    if (existingOrganization.rows.length > 0) {
      console.log(`Organization with domain or subdomain already exists. Skipping insertion.`);
    } else {
      // Insert the new organization
      await pool.query(
        `INSERT INTO "Organization" (organizationname, domain, subdomain, contactemail, databasename, databaseurl, updatedat)
         VALUES ($1, $2, $3, $4, $5, $6, NOW())`,
        [organizationName, domain, subdomain, contactEmail, dbName, organizationDbUrl]
      );
      console.log(`Organization "${organizationName}" created successfully.`);
    }

    // Create the new organization database if it doesn't already exist
    const dbCheckResult = await pool.query(`SELECT 1 FROM pg_database WHERE datname = $1`, [
      dbName,
    ]);

    if (dbCheckResult.rows.length === 0) {
      await pool.query(`CREATE DATABASE ${dbName};`);
      console.log(`Database "${dbName}" created successfully.`);
    } else {
      console.log(`Database "${dbName}" already exists. Skipping creation.`);
    }

    // Connect to the newly created organization's database
    const organizationPool = new Pool({ connectionString: organizationDbUrl });

    // Create the required enum types and tables
    const enumTypes = [
      { name: 'QuestionType', values: "'MULTIPLE_CHOICE', 'TRUE_FALSE', 'SHORT_ANSWER'" },
      { name: 'AppointmentStatus', values: "'PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELED'" },
      { name: 'MentorshipRequestStatus', values: "'PENDING', 'ACCEPTED', 'REJECTED'" },
      { name: 'MilestoneStatus', values: "'NOT_STARTED', 'IN_PROGRESS', 'COMPLETED'" },
      { name: 'AI Chatbot', values: "'PENDING', 'ACCEPTED', 'REJECTED'" },
      { name: 'Development Hub', values: "'PENDING', 'ACCEPTED', 'REJECTED'" },
      { name: 'My SKills', values: "'PENDING', 'ACCEPTED', 'REJECTED'" },
      { name: 'Enterprise Solution', values: "'PENDING', 'ACCEPTED', 'REJECTED'" },
    ];

    for (const { name, values } of enumTypes) {
      try {
        await organizationPool.query(`CREATE TYPE "${name}" AS ENUM (${values});`);
        console.log(`Type "${name}" created successfully.`);
      } catch (error) {
        const dbError = error as DatabaseError;
        if (dbError.code === '42710') {
          console.log(`Type "${name}" already exists. Skipping creation.`);
        } else {
          console.error(`Error creating type "${name}":`, dbError.message);
        }
      }
    }

    await organizationPool.query(`
        -- User Table
     CREATE TABLE "User" (
    "id" VARCHAR(255) PRIMARY KEY,
    "name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) UNIQUE,
    "aboutMe" TEXT,
    "linkedInProfileLink" TEXT,
    "profilePictureURL" TEXT,
    "profileBackgroundURL" TEXT,
    "isMentor" BOOLEAN DEFAULT false,
    "isMentee" BOOLEAN DEFAULT false,
    "availability" TEXT,
    "country" VARCHAR(255),
    "specialization" VARCHAR(255),
    "rating" FLOAT,
    "role" VARCHAR(50) DEFAULT 'USER',
    "overallRating" FLOAT DEFAULT 0,
    "price" FLOAT DEFAULT 0,
    "mentorAreas" TEXT[],
    "menteeInterests" TEXT[],
    "createdAt" TIMESTAMP DEFAULT NOW(),
    "updatedAt" TIMESTAMP DEFAULT NOW()
);

-- Category Table
CREATE TABLE "Category" (
    "id" SERIAL PRIMARY KEY,
    "name" VARCHAR(255) NOT NULL
);

-- Assessment Table
CREATE TABLE "Assessment" (
    "id" SERIAL PRIMARY KEY,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT NOT NULL,
    "objective" TEXT,
    "duration" INT NOT NULL,
    "categoryId" INT NOT NULL REFERENCES "Category"("id")
);

-- Certificate Table
CREATE TABLE "Certificate" (
    "id" SERIAL PRIMARY KEY,
    "userId" VARCHAR(255) NOT NULL REFERENCES "User"("id"),
    "assessmentId" INT NOT NULL REFERENCES "Assessment"("id"),
    "resultId" INT NOT NULL,
    "url" TEXT NOT NULL,
    "issuedAt" TIMESTAMP DEFAULT NOW(),
    UNIQUE ("resultId")
);

-- QuizResult Table
CREATE TABLE "QuizResult" (
    "id" SERIAL PRIMARY KEY,
    "userId" VARCHAR(255) NOT NULL REFERENCES "User"("id"),
    "assessmentId" INT NOT NULL REFERENCES "Assessment"("id"),
    "score" FLOAT NOT NULL,
    "passed" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP DEFAULT NOW(),
    UNIQUE ("userId", "assessmentId")
);

-- Question Table
CREATE TABLE "Question" (
    "id" SERIAL PRIMARY KEY,
    "text" TEXT NOT NULL,
    "questionType" "QuestionType" NOT NULL,
    "assessmentId" INT NOT NULL REFERENCES "Assessment"("id")
);

-- Option Table
CREATE TABLE "Option" (
    "id" SERIAL PRIMARY KEY,
    "text" TEXT NOT NULL,
    "isCorrect" BOOLEAN NOT NULL,
    "questionId" INT NOT NULL REFERENCES "Question"("id")
);


     -- UserAnswer Table
CREATE TABLE "UserAnswer" (
    "id" SERIAL PRIMARY KEY,
    "userId" VARCHAR(255) NOT NULL REFERENCES "User"("id"),
    "assessmentId" INT NOT NULL REFERENCES "Assessment"("id"),
    "questionId" INT NOT NULL REFERENCES "Question"("id"),
    "selectedOptionId" INT REFERENCES "Option"("id"),
    "shortAnswerText" TEXT,
    "isCorrect" BOOLEAN NOT NULL,
    UNIQUE ("userId", "assessmentId", "questionId")
);

-- Review Table
CREATE TABLE "Review" (
    "id" SERIAL PRIMARY KEY,
    "content" TEXT NOT NULL,
    "rating" FLOAT NOT NULL,
    "userId" VARCHAR(255) NOT NULL REFERENCES "User"("id"),
    "mentorId" VARCHAR(255) NOT NULL REFERENCES "User"("id"),
    "createdAt" TIMESTAMP DEFAULT NOW()
);

-- Video Table
CREATE TABLE "Video" (
    "id" SERIAL PRIMARY KEY,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "embeddingLink" TEXT,
    "videoLength" VARCHAR(50),
    "mentorId" VARCHAR(255) NOT NULL REFERENCES "User"("id")
);

-- Appointment Table
CREATE TABLE "Appointment" (
    "id" SERIAL PRIMARY KEY,
    "date" TIMESTAMP NOT NULL,
    "status" "AppointmentStatus" DEFAULT 'PENDING',
    "mentorId" VARCHAR(255) NOT NULL REFERENCES "User"("id"),
    "menteeId" VARCHAR(255) NOT NULL REFERENCES "User"("id")
);

-- Milestone Table
CREATE TABLE "Milestone" (
    "id" SERIAL PRIMARY KEY,
    "userId" VARCHAR(255) NOT NULL REFERENCES "User"("id"),
    "title" VARCHAR(255),
    "status" "MilestoneStatus" NOT NULL,
    "startDate" TIMESTAMP NOT NULL,
    "endDate" TIMESTAMP NOT NULL
);

-- MilestoneStep Table
CREATE TABLE "MilestoneStep" (
    "id" SERIAL PRIMARY KEY,
    "milestoneId" INT NOT NULL REFERENCES "Milestone"("id"),
    "name" VARCHAR(255),
    "status" "MilestoneStatus" NOT NULL
);

-- Discussion Table
CREATE TABLE "Discussion" (
    "id" SERIAL PRIMARY KEY,
    "title" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP DEFAULT NOW()
);

-- Comment Table
CREATE TABLE "Comment" (
    "id" SERIAL PRIMARY KEY,
    "content" TEXT NOT NULL,
    "discussionId" INT NOT NULL REFERENCES "Discussion"("id") ON DELETE CASCADE,
    "createdAt" TIMESTAMP DEFAULT NOW()
);

-- Chat Table
CREATE TABLE "Chat" (
    "id" SERIAL PRIMARY KEY,
    "createdAt" TIMESTAMP DEFAULT NOW(),
    "updatedAt" TIMESTAMP DEFAULT NOW()
);

-- ChatParticipant Table
CREATE TABLE "ChatParticipant" (
    "chatId" INT NOT NULL REFERENCES "Chat"("id"),
    "userId" VARCHAR(255) NOT NULL REFERENCES "User"("id"),
    "joinedAt" TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY ("chatId", "userId")
);


    -- Message Table
CREATE TABLE "Message" (
    "id" SERIAL PRIMARY KEY,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP DEFAULT NOW(),
    "chatId" INT NOT NULL REFERENCES "Chat"("id") ON DELETE CASCADE,
    "senderId" VARCHAR(255) NOT NULL REFERENCES "User"("id")
);

-- MentorshipRequest Table
CREATE TABLE "MentorshipRequest" (
    "id" SERIAL PRIMARY KEY,
    "mentorId" VARCHAR(255) NOT NULL REFERENCES "User"("id"),
    "menteeId" VARCHAR(255) NOT NULL REFERENCES "User"("id"),
    "status" "MentorshipRequestStatus" NOT NULL,
    "message" TEXT,
    "createdAt" TIMESTAMP DEFAULT NOW(),
    "updatedAt" TIMESTAMP DEFAULT NOW(),
    UNIQUE ("mentorId", "menteeId")
);

-- MentorMentee Table
CREATE TABLE "MentorMentee" (
    "mentorId" VARCHAR(255) NOT NULL REFERENCES "User"("id"),
    "menteeId" VARCHAR(255) NOT NULL REFERENCES "User"("id"),
    "createdAt" TIMESTAMP DEFAULT NOW(),
    "updatedAt" TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY ("mentorId", "menteeId")
);

-- Education Table
CREATE TABLE "Education" (
    "id" SERIAL PRIMARY KEY,
    "userId" VARCHAR(255) NOT NULL REFERENCES "User"("id"),
    "institution" VARCHAR(255),
    "degree" VARCHAR(255),
    "fieldOfStudy" VARCHAR(255),
    "startDate" TIMESTAMP NOT NULL,
    "endDate" TIMESTAMP,
    "grade" VARCHAR(50),
    "onGoing" BOOLEAN NOT NULL
);

-- Experience Table
CREATE TABLE "Experience" (
    "id" SERIAL PRIMARY KEY,
    "userId" VARCHAR(255) NOT NULL REFERENCES "User"("id"),
    "position" VARCHAR(255),
    "company" VARCHAR(255),
    "location" VARCHAR(255),
    "startDate" TIMESTAMP NOT NULL,
    "endDate" TIMESTAMP,
    "current" BOOLEAN NOT NULL
);

-- Skill Table
CREATE TABLE "Skill" (
    "id" SERIAL PRIMARY KEY,
    "userId" VARCHAR(255) NOT NULL REFERENCES "User"("id"),
    "name" VARCHAR(255) NOT NULL
);

-- DevelopmentArea Table
CREATE TABLE "DevelopmentArea" (
    "id" SERIAL PRIMARY KEY,
    "userId" VARCHAR(255) NOT NULL REFERENCES "User"("id"),
    "name" VARCHAR(255) NOT NULL
);

-- BlogPost Table
CREATE TABLE "BlogPost" (
    "id" SERIAL PRIMARY KEY,
    "title" VARCHAR(255),
    "content" TEXT,
    "date" TIMESTAMP DEFAULT NOW(),
    "author" VARCHAR(255),
    "imagePath" TEXT
);

-- MediaRelease Table
CREATE TABLE "MediaRelease" (
    "id" SERIAL PRIMARY KEY,
    "title" VARCHAR(255),
    "description" TEXT,
    "imagePath" TEXT,
    "href" TEXT
);

-- MentorFeedback Table
CREATE TABLE "MentorFeedback" (
    "id" SERIAL PRIMARY KEY,
    "mentorId" VARCHAR(255),
    "menteeId" VARCHAR(255),
    "rating" INT CHECK ("rating" BETWEEN 1 AND 5),
    "feedback" TEXT,
    "receivedDate" TIMESTAMP DEFAULT NOW()
);

-- Organization Table
CREATE TABLE "Organization" (
    "id" SERIAL PRIMARY KEY,
    "organizationname" VARCHAR(255) NOT NULL UNIQUE,  
    "domain" VARCHAR(255) NOT NULL,                   
    "subdomain" VARCHAR(255),                         
    "databasename" VARCHAR(255),                      
    "contactemail" VARCHAR(255),                      
    "databaseurl" TEXT NOT NULL,                      
    "isactive" BOOLEAN DEFAULT true,                  
    "createdat" TIMESTAMP DEFAULT NOW(),              
    "updatedat" TIMESTAMP DEFAULT NOW(),              
    CONSTRAINT unique_organization_domain_subdomain UNIQUE ("domain", "subdomain")
);

-- OrganizationLog Table
CREATE TABLE "OrganizationLog" (
    "id" SERIAL PRIMARY KEY,
    "action" VARCHAR(50) NOT NULL,                                                 
    "createdAt" TIMESTAMP DEFAULT NOW()                                            
);


    -- Theme Table (linked to Organization)
CREATE TABLE "Theme" (
    "id" SERIAL PRIMARY KEY,
    "organizationId" INT NOT NULL REFERENCES "Organization"("id") ON DELETE CASCADE, 
    "logoUrl" TEXT,                                                                
    "backgroundColor" VARCHAR(7),                                                  
    "textColor" VARCHAR(7),                                                        
    "createdAt" TIMESTAMP DEFAULT NOW(),                                           
    "updatedAt" TIMESTAMP DEFAULT NOW()                                            
);

-- AdminUser Table
CREATE TABLE "AdminUser" (
    "id" SERIAL PRIMARY KEY,
    "email" VARCHAR(255) UNIQUE NOT NULL,                
    "password" VARCHAR(255) NOT NULL,                    
    "role" VARCHAR(50) DEFAULT 'ADMIN',                  
    "createdAt" TIMESTAMP DEFAULT NOW(),                 
    "updatedAt" TIMESTAMP DEFAULT NOW()                  
);

-- Badge Table
CREATE TABLE "Badge" (
    "id" SERIAL PRIMARY KEY,
    "userId" VARCHAR(255) NOT NULL REFERENCES "User"("id"),
    "name" VARCHAR(255),
    "icon" TEXT,
    "senderName" VARCHAR(255),
    "receivedDate" TIMESTAMP DEFAULT NOW(),
    "message" TEXT
);

-- GetInTouch Table
CREATE TABLE "GetInTouch" (
    "id" SERIAL PRIMARY KEY,
    "firstName" VARCHAR(255),
    "lastName" VARCHAR(255),
    "email" VARCHAR(255),
    "demo" BOOLEAN,
    "feedback" BOOLEAN,
    "question" BOOLEAN,
    "message" TEXT,
    "receivedDate" TIMESTAMP
);

-- FeatureFlag Table
CREATE TABLE "FeatureFlag" (
    "id" SERIAL PRIMARY KEY,
    "organizationId" INT NOT NULL REFERENCES "Organization"("id") ON DELETE CASCADE,
    "featureName" VARCHAR(255) NOT NULL,
    "isEnabled" BOOLEAN DEFAULT false,
    "createdAt" TIMESTAMP DEFAULT NOW(),
    "updatedAt" TIMESTAMP DEFAULT NOW(),
    UNIQUE ("organizationId", "featureName")
);
      
    `);

    // Insert default features for the new organization into the main database's FeatureFlag table
    for (const featureName of defaultFeatures) {
      try {
        await pool.query(
          `
          INSERT INTO "FeatureFlag" ("organizationId", "featureName", "isEnabled", "createdAt", "updatedAt")
          VALUES ($1, $2, true, now(), now())
          ON CONFLICT ("organizationId", "featureName") DO NOTHING;
        `,
          [existingOrganization.rows[0]?.id, featureName] // Optional chaining in case organization doesn't exist
        );

        await organizationPool.query(
          `
          INSERT INTO "FeatureFlag" ("organizationId", "featureName", "isEnabled", "createdAt", "updatedAt")
          VALUES ($1, $2, true, now(), now())
          ON CONFLICT ("organizationId", "featureName") DO NOTHING;
        `,
          [existingOrganization.rows[0]?.id, featureName] // Optional chaining in case organization doesn't exist
        );

        console.log(`Added feature "${featureName}" for organization "${organizationName}".`);
      } catch (error) {
        const dbError = error as DatabaseError;
        console.error(
          `Error adding feature "${featureName}" for organization "${organizationName}":`,
          dbError.message
        );
      }
    }

    console.log(`Default feature flags added for organization "${organizationName}".`);

    return organizationDbUrl;
  } catch (error) {
    const dbError = error as DatabaseError;
    console.error('Error creating organization database:', dbError.message);
    return organizationDbUrl;
  } finally {
    await pool.end();
  }
}
