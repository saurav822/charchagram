/**
 * @module config/swagger
 *
 * Swagger / OpenAPI 3 documentation configuration.
 *
 * Scans all `@swagger` JSDoc annotations in `src/routes/*.js` and generates
 * the OpenAPI spec at startup.  The interactive UI is served at `/api-docs`.
 *
 * Server list is environment-aware: development includes localhost, production
 * only shows the deployed URL.  The local port matches the PORT env variable.
 */

import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();
const isProduction = process.env.NODE_ENV === 'production';

const servers = isProduction 
  ? [
      {
        url: 'https://charchagrambackend.onrender.com',
        description: 'Production server'
      }
    ]
  : [
      {
        url: 'http://localhost:3002',
        description: 'Development server'
      },
      {
        url: 'https://charchagrambackend.onrender.com',
        description: 'Production server'
      }
    ];


const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Charcha Manch Constituency API',
      version: '1.0.0',
      description: 'API for managing constituency information, representative details, departments, and candidate data',
      contact: {
        name: 'API Support',
        email: 'support@charchamanch.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: servers,
    components: {
      schemas: {
        Constituency: {
          type: 'object',
          properties: {
            area_name: {
              type: 'string',
              description: 'Name of the constituency',
              example: 'Raghopur Vidhan Sabha Kshetra'
            },
            vidhayak_info: {
              type: 'object',
              properties: {
                name: {
                  type: 'string',
                  description: 'Name of the representative',
                  example: 'तेजस्वी यादव'
                },
                age: {
                  type: 'number',
                  description: 'Age of the representative',
                  example: 58
                },
                party_name: {
                  type: 'string',
                  description: 'Political party name',
                  example: 'RJD'
                },
                last_election_vote_percentage: {
                  type: 'string',
                  description: 'Vote percentage in last election',
                  example: '52.3%'
                },
                experience: {
                  type: 'number',
                  description: 'Years of experience',
                  example: 15
                }
              }
            },
            dept_info: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: {
                    type: 'string',
                    description: 'Unique department ID (UUID)',
                    example: '123e4567-e89b-12d3-a456-426614174000'
                  },
                  dept_name: {
                    type: 'string',
                    description: 'Name of the department',
                    example: 'स्वास्थ्य'
                  },
                  work_info: {
                    type: 'array',
                    items: {
                      type: 'string'
                    },
                    description: 'List of work done by the department',
                    example: ['प्रत्येक गांव में प्राथमिक स्वास्थ्य केंद्र', '24/7 एम्बुलेंस सेवा']
                  }
                }
              }
            },
            other_candidates: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  candidate_name: {
                    type: 'string',
                    description: 'Name of the candidate',
                    example: 'राहुल शर्मा'
                  },
                  candidate_party: {
                    type: 'string',
                    description: 'Political party of the candidate',
                    example: 'Congress'
                  },
                  vote_share: {
                    type: 'string',
                    description: 'Vote share percentage',
                    example: '18.2%'
                  }
                }
              }
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              description: 'Error type'
            },
            message: {
              type: 'string',
              description: 'Error message'
            }
          }
        }
      }
    }
  },
  apis: ['./src/routes/*.js'] // Path to the API routes
};

const specs = swaggerJsdoc(options);

export { specs, swaggerUi };
