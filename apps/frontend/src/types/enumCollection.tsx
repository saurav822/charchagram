/**
 * Select option arrays for user profile forms.
 *
 * Age bracket values MUST match the Mongoose UserSchema enum exactly:
 *   ['18-25', '26-35', '36-45', '46-55', '56-65', '65+']
 * A mismatch causes Mongoose to silently reject the field on update.
 *
 * The canonical source for these constants is packages/shared/src/constants.ts.
 */

/** Age bracket options shown in the registration and profile edit forms. */
const ageGroupOptions = [
  { value: '18-25', label: '18-25' },
  { value: '26-35', label: '26-35' },
  { value: '36-45', label: '36-45' },
  { value: '46-55', label: '46-55' },
  { value: '56-65', label: '56-65' },
  { value: '65+', label: '65+' },
];

/** Gender options shown in the registration and profile edit forms (Hindi labels). */
const genderOptions = [
  { value: 'male', label: 'पुरुष' },
  { value: 'female', label: 'महिला' },
  { value: 'other', label: 'अन्य' },
  { value: 'prefer not to say', label: 'प्राथमिकता नहीं' },
];

export { ageGroupOptions, genderOptions };
