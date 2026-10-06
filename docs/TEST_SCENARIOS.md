# 🧪 Example Test Scenarios

Test these scenarios to verify your Payload CMS MCP server is working correctly.

## 🟢 Basic Scenarios

### 1. Field Types Query
**Command:**
```
What field types are available in Payload CMS?
```

**Expected Result:**
List of all Payload CMS field types including text, richText, number, email, etc.

**Verifies:** Resources are working

---

### 2. Best Practices Query
**Command:**
```
What are the best practices for collections in Payload CMS?
```

**Expected Result:**
List of best practices for collections including TypeScript usage, slug naming, timestamps, etc.

**Verifies:** Resources and query tool working

---

### 3. Simple Collection Generation
**Command:**
```
Generate a basic blog post collection with title and content fields
```

**Expected Result:**
Complete TypeScript collection definition with proper structure

**Verifies:** Generation tools working

---

## 🟡 Intermediate Scenarios

### 4. Complex Collection with Relationships
**Command:**
```
Generate a products collection with:
- Name (required, unique)
- Description (rich text)
- Price (number)
- Categories (relationship to categories collection)
- Images (array of uploads)
- Include timestamps and versioning
```

**Expected Result:**
Complete collection with all specified fields, proper types, and relationships

**Verifies:** Complex generation with relationships

---

### 5. Code Validation
**Command:**
```
Validate this Payload CMS collection:

export const Posts = {
  slug: 'posts',
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'content',
      type: 'richText',
    }
  ]
}
```

**Expected Result:**
Validation report with any issues, warnings, and suggestions

**Verifies:** Validation tool working

---

### 6. Field Generation with Validation
**Command:**
```
Generate an email field with validation that checks for proper email format and includes a custom error message
```

**Expected Result:**
Field definition with email type and proper validation function

**Verifies:** Field generation with validation

---

## 🔴 Advanced Scenarios

### 7. Full Project Scaffolding
**Command:**
```
Scaffold a Payload CMS project named "my-blog" at /Users/tony/projects/test-payload with:
- MongoDB database
- Authentication enabled
- Collections: posts, categories, authors, comments
- TypeScript enabled
```

**Expected Result:**
- Complete project structure created
- All specified collections generated
- Configuration files in place
- package.json with correct dependencies
- README with setup instructions

**Verifies:** Full project scaffolding capability

---

### 8. Multi-Step Project Creation (with filesystem MCP)
**Command:**
```
1. Create a new Payload CMS project for an e-commerce store at /Users/tony/projects/shop
2. Include collections for products, orders, customers, and reviews
3. Set up MongoDB
4. Write all files to disk
5. Show me the project structure
```

**Expected Result:**
- Project scaffolded
- Files written to specified location
- Project structure displayed
- Ready to run with `npm install && npm run dev`

**Verifies:** Integration with filesystem MCP

---

### 9. Code Review and Improvement
**Command:**
```
Review this collection and suggest improvements:

export const Users = {
  slug: 'users',
  fields: [
    { name: 'name', type: 'text' },
    { name: 'email', type: 'text' }
  ]
}
```

**Expected Result:**
- Validation issues identified (email should be 'email' type, not 'text')
- Suggestions for auth, timestamps, access control
- Best practices recommendations
- Improved version of the code

**Verifies:** Validation + best practices querying

---

### 10. Migration Scenario
**Command:**
```
Help me migrate this Payload 2.x collection to version 3.0:

export default {
  slug: 'posts',
  admin: {
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
  ],
}
```

**Expected Result:**
- Updated collection for v3
- Explanation of changes
- Migration notes

**Verifies:** Migration prompt and knowledge

---

## 🔗 Integration Scenarios

### 11. With React Specialist
**Command:**
```
@payload-cms Generate a posts collection with title, content, author, and published date

@react-specialist Create a React component that fetches and displays posts from this Payload CMS API
```

**Expected Result:**
- Payload collection generated
- React component with proper API integration
- TypeScript types
- Loading and error states

**Verifies:** Multi-agent collaboration

---

### 12. With Next.js Developer
**Command:**
```
@payload-cms Create a blog project with posts and categories

@nextjs-developer Set up Next.js App Router integration with this Payload CMS project
```

**Expected Result:**
- Payload project structure
- Next.js integration code
- API routes
- Server components

**Verifies:** Next.js integration

---

### 13. With UI Designer
**Command:**
```
@payload-cms Create a products collection for an e-commerce site

@ui-designer Design a custom admin dashboard for managing these products
```

**Expected Result:**
- Products collection with appropriate fields
- UI design mockup for admin panel
- Custom styling suggestions

**Verifies:** Design collaboration

---

## 📁 File Operation Scenarios (requires filesystem MCP)

### 14. Read Project Files
**Command:**
```
Read the collections from my Payload project at /Users/tony/projects/my-blog
```

**Expected Result:**
- List of collection files
- Brief overview of each collection

**Verifies:** File reading capability

---

### 15. Update Existing Collection
**Command:**
```
Read the posts collection from /Users/tony/projects/my-blog/src/collections/posts.ts

Add these fields:
- Featured image (upload)
- SEO title (text)
- SEO description (textarea)
- Tags (relationship to tags collection)

Write the updated collection back to the file
```

**Expected Result:**
- Original collection read
- New fields added with proper types
- Updated file written
- Confirmation of changes

**Verifies:** Read, modify, write workflow

---

### 16. Create New Collection in Existing Project
**Command:**
```
In my project at /Users/tony/projects/my-blog, create a new comments collection with:
- Post relationship
- Author name
- Email
- Comment text
- Approved status
- Moderation features

Write it to src/collections/comments.ts
```

**Expected Result:**
- New collection file created
- Proper structure and relationships
- File written to correct location

**Verifies:** New file creation in existing project

---

## 🎯 Real-World Scenarios

### 17. Complete Blog Setup
**Command:**
```
I need a complete blog setup. Please:

1. Scaffold a new Payload project at ~/projects/tech-blog
2. Create collections for:
   - Posts (with rich content, categories, tags, author)
   - Authors (with bio, social links, profile image)
   - Categories (with description, slug)
   - Tags (simple name and slug)
   - Comments (with moderation)
3. Set up proper relationships between collections
4. Include authentication for authors
5. Add access control (public read, authenticated write)
6. Use PostgreSQL as the database
```

**Expected Result:**
- Complete, production-ready blog project
- All collections with proper relationships
- Access control implemented
- Ready for deployment

**Verifies:** End-to-end project creation

---

### 18. E-commerce Platform
**Command:**
```
Build an e-commerce platform with:

1. Products collection (variants, inventory, images)
2. Categories collection (hierarchical)
3. Orders collection (with order items, status tracking)
4. Customers collection (with addresses, order history)
5. Reviews collection (with ratings, moderation)

Include proper access control:
- Public can read products and categories
- Authenticated users can place orders and write reviews
- Admin can manage everything

Use MongoDB and TypeScript
Create at ~/projects/my-shop
```

**Expected Result:**
- Complete e-commerce project structure
- All collections with proper relationships
- Role-based access control
- Cart and checkout logic hooks
- Order management system

**Verifies:** Complex business logic implementation

---

### 19. Multi-language Content Site
**Command:**
```
Create a multi-language content management system:

1. Articles collection (localized title, content, slug)
2. Pages collection (localized content, SEO fields)
3. Navigation menus (localized labels)
4. Site settings global (localized metadata)

Support English, Spanish, and French
Include proper fallback handling
```

**Expected Result:**
- Collections with localized fields
- Proper locale configuration
- Fallback strategies
- SEO optimization for each locale

**Verifies:** Localization features

---

### 20. SaaS Application Backend
**Command:**
```
Build a SaaS application backend:

1. Organizations collection (with subscription tiers)
2. Users collection (with organization relationships, roles)
3. Projects collection (belongs to organizations)
4. API Keys collection (for programmatic access)
5. Usage tracking collection

Implement:
- Multi-tenancy (data isolation per organization)
- Role-based access (owner, admin, member, viewer)
- Usage limits based on subscription tier
- Audit logging hooks

Use PostgreSQL
Create at ~/projects/saas-backend
```

**Expected Result:**
- Multi-tenant architecture
- Complex access control patterns
- Usage tracking and limits
- Audit trail implementation
- Subscription management

**Verifies:** Enterprise-level features

---

## 🐛 Error Handling Scenarios

### 21. Invalid Collection Code
**Command:**
```
Validate this collection:

export const Bad = {
  // Missing slug
  fields: []
}
```

**Expected Result:**
- Clear error message about missing slug
- Suggestion to add required fields
- Example of correct structure

**Verifies:** Error detection and helpful feedback

---

### 22. Invalid Path
**Command:**
```
Scaffold a project at /this/path/does/not/exist/project
```

**Expected Result:**
- Error message about invalid path
- Suggestion to use an existing directory
- Graceful error handling

**Verifies:** Path validation

---

### 23. Conflicting Requirements
**Command:**
```
Generate a collection with:
- Field named 'id' (reserved keyword)
- Slug with spaces and special characters
```

**Expected Result:**
- Warning about reserved keywords
- Suggestion to rename field
- Slug sanitization recommendation

**Verifies:** Validation of conflicting requirements

---

## 💡 Edge Cases

### 24. Very Large Collection
**Command:**
```
Generate a collection with 50+ fields covering all field types
```

**Expected Result:**
- Properly structured collection
- All field types represented
- Performance considerations noted
- Suggestion about using tabs or groups for organization

**Verifies:** Handling of large collections

---

### 25. Circular Relationships
**Command:**
```
Create collections where:
- Authors have a relationship to Posts
- Posts have a relationship to Authors
- Categories have parent Categories (self-referential)
```

**Expected Result:**
- Proper bidirectional relationships
- Self-referential relationship handled
- Warning about potential circular references
- Best practices for managing these relationships

**Verifies:** Complex relationship handling

---

### 26. Custom Field Type
**Command:**
```
Generate a field that uses a custom field type called 'colorPicker'
```

**Expected Result:**
- Field structure for custom type
- Note that custom fields need to be registered
- Example of how to register custom field types

**Verifies:** Custom field type support

---

## 📊 Performance Scenarios

### 27. Optimized Query Collection
**Command:**
```
Generate a products collection optimized for:
- Fast text search on name and description
- Filtering by multiple categories
- Sorting by price and popularity
- Pagination

Include appropriate indexes
```

**Expected Result:**
- Fields with index: true on searchable fields
- Proper field types for efficient querying
- Suggestions for database indexes
- Pagination configuration

**Verifies:** Performance optimization knowledge

---

### 28. Large File Upload Collection
**Command:**
```
Create a media library collection for:
- Video uploads (large files)
- Image galleries
- Document storage

Include:
- File size limits
- Format restrictions
- Thumbnail generation
- Cloud storage integration suggestions
```

**Expected Result:**
- Upload field configuration
- Size and format validation
- Hooks for thumbnail generation
- Best practices for cloud storage

**Verifies:** File handling optimization

---

## 🔒 Security Scenarios

### 29. Secure User Collection
**Command:**
```
Generate a users collection with maximum security:
- Encrypted passwords
- Email verification
- Two-factor authentication support
- Login attempt limiting
- Password reset flow
- Secure session management
```

**Expected Result:**
- Auth-enabled collection
- Security hooks
- Field-level access control
- Best practices for authentication
- References to security plugins

**Verifies:** Security best practices

---

### 30. API Key Management
**Command:**
```
Create a collection for managing API keys with:
- Automatic key generation
- Expiration dates
- Usage rate limiting
- Scope restrictions
- Revocation capability
```

**Expected Result:**
- Secure key storage pattern
- Hooks for key generation and validation
- Access control for key management
- Audit logging integration

**Verifies:** API security patterns

---

## 🎓 Learning Scenarios

### 31. Beginner Tutorial
**Command:**
```
I'm new to Payload CMS. Walk me through creating my first collection for a simple todo list app
```

**Expected Result:**
- Step-by-step explanation
- Simple collection with essential fields
- Explanation of each field type
- Tips for admin panel usage

**Verifies:** Educational capability

---

### 32. Best Practices Explanation
**Command:**
```
Explain the best practices for access control in Payload CMS with examples
```

**Expected Result:**
- Detailed explanation of access control
- Multiple examples (read, create, update, delete)
- Field-level vs collection-level
- Common patterns and pitfalls

**Verifies:** Knowledge sharing

---

### 33. Migration Guide
**Command:**
```
I have a Payload 2.x project. What's the migration process to 3.0?
```

**Expected Result:**
- Migration steps
- Breaking changes list
- Code transformation examples
- Testing recommendations

**Verifies:** Migration knowledge

---

## ✅ Success Criteria

For each scenario, verify:
- ✅ Tool/Resource executed correctly
- ✅ Response is accurate and complete
- ✅ Code is valid TypeScript/JavaScript
- ✅ Follows Payload CMS 3.0 best practices
- ✅ Includes helpful explanations
- ✅ Error handling is appropriate
- ✅ Integration with other tools works

---

## 🚀 Running the Tests

### Quick Test Suite
Run these in order to verify basic functionality:
1. Scenario 1 (Field types)
2. Scenario 3 (Simple generation)
3. Scenario 5 (Validation)
4. Scenario 7 (Scaffolding)

### Full Test Suite
Run all 33 scenarios to verify complete functionality

### Automated Testing
Consider creating a test script that runs these scenarios and validates outputs programmatically.

---

## 📝 Notes

- Some scenarios require the filesystem MCP server
- Real file operations should be tested in a safe directory
- Always backup existing projects before testing modifications
- Performance scenarios may need actual database connections
- Security scenarios should follow your organization's guidelines

---

## 🎉 Success!

If all scenarios pass, your Payload CMS MCP server is working perfectly and ready for production use!

Happy coding! 🚀
