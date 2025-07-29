import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { Transform } from 'class-transformer'; 

/**
 * A helper function to capitalize the first letter of each word in a string.
 * Handles all-caps, all-lowercase, and mixed-case inputs.
 * @param name The string to format.
 * @returns The formatted string, e.g., "steve aRNOLD" -> "Steve Arnold".
 */
const capitalizeName = (name: string): string => {
  if (!name || typeof name !== 'string') {
    return name;
  }
  // Convert the whole string to lowercase, then split into words
  return name
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize first letter of each word
    .join(' '); // Join them back together
};

export class CreateContactSubmissionDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100, { message: 'Name must not exceed 100 characters.' })
  @Transform(({ value }) => capitalizeName(value))
  name: string;

  @IsEmail({}, { message: 'A valid email address is required.' })
  @IsNotEmpty({ message: 'Email cannot be empty.' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Subject cannot be empty.' })
  subject: string;

  @IsString()
  @IsNotEmpty({ message: 'Message cannot be empty.' })
  @MaxLength(5000, { message: 'Message must not exceed 5000 characters.' })
  message: string;
}