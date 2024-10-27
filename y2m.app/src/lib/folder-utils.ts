import fs from 'fs';
import path from 'path';

export async function createOrganizationFolder(organizationName: string): Promise<void> {
  const organizationFolderPath = path.join(
    process.cwd(),
    'src',
    'app',
    'organization',
    organizationName
  );

  console.log('Creating folder at:', organizationFolderPath);

  if (!fs.existsSync(organizationFolderPath)) {
    fs.mkdirSync(organizationFolderPath, { recursive: true });
    console.log(
      `Folder for organization "${organizationName}" created successfully at: ${organizationFolderPath}`
    );
  } else {
    console.log(
      `Folder for organization "${organizationName}" already exists at: ${organizationFolderPath}`
    );
  }
}
