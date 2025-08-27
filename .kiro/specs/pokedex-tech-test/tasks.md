# Implementation Plan

- [x] 1. Create database schema for moves and pokemon-moves tables
  - Create move entity with proper Drizzle schema including id, name, accuracy, damageClass, power, pp, and typeId fields
  - Create pokemon-move join entity with pokemonId, moveId, and level fields
  - Add proper relations between moves, pokemon-moves, and existing entities
  - Update schema index file to export new entities
  - _Requirements: 1.1, 1.2, 1.3_

- [x] 2. Update database configuration and run migrations
  - Add new schema files to drizzle.config.ts configuration
  - Generate and run database migration for new tables
  - Update seed script to include moves and pokemon-moves data
  - Run barrel generation command to update exports
  - _Requirements: 1.3, 1.4, 1.5_

- [x] 3. Create shared types for moves and enhanced pokemon data
  - Create ViewMoveDto class with proper validation decorators
  - Create PokemonMoveDto class for move-pokemon relationships
  - Enhance ViewPokemonDto to optionally include moves data
  - Update shared-types index to export new DTOs
  - _Requirements: 2.1, 2.2_

- [x] 4. Implement move repository with base functionality
  - Create MoveRepository extending BaseRepository pattern
  - Implement findMovesByPokemonId method with proper joins
  - Add move module configuration following existing patterns
  - Write unit tests for repository methods
  - _Requirements: 2.2, 2.3_

- [x] 5. Enhance pokemon repository with moves data
  - Extend findPokemonById method to include moves relationships
  - Add deletePokemon method with proper error handling
  - Update existing methods to optionally include moves data
  - Implement proper query optimization for move relationships
  - _Requirements: 2.1, 4.4, 4.5_

- [x] 6. Create enhanced pokemon service methods
  - Add findPokemonWithMoves method for detailed pokemon data
  - Implement deletePokemon service method with admin authorization
  - Update existing service methods to handle moves data transformation
  - Add proper error handling and validation
  - _Requirements: 2.1, 4.4, 4.5_

- [x] 7. Add pokemon detail endpoint to API controller
  - Create GET /pokemon/:id endpoint returning pokemon with moves
  - Add DELETE /pokemon/:id endpoint with admin authorization
  - Implement proper HTTP status codes and error responses
  - Add request validation and parameter sanitization
  - _Requirements: 2.1, 4.4, 4.5_

- [x] 8. Extend user schema with admin functionality
  - Add isAdmin boolean field to user entity with default false
  - Generate and run migration for user table update
  - Update UserDto and related types to include admin field
  - Update authentication context to include admin status
  - _Requirements: 4.1, 4.2_

- [x] 9. Create reusable Pokemon card component
  - Extract PokemonCard component from home page with proper props interface
  - Add conditional rendering for delete button based on admin status
  - Implement onClick handlers for view and delete actions
  - Add proper TypeScript interfaces and prop validation
  - _Requirements: 3.1, 3.2, 3.3, 4.2, 4.3_

- [x] 10. Create sortable moves table component
  - Build MovesTable component with sortable headers for level and power
  - Implement sort state management with default level ascending
  - Add proper table styling using existing UI components
  - Create MoveRow component for individual move display
  - _Requirements: 2.3, 2.4, 2.5_

- [x] 11. Build pokemon detail modal component
  - Create PokemonDetailModal component with proper modal behavior
  - Integrate pokemon detail API call using React Query
  - Add MovesTable component integration with fetched data
  - Implement modal open/close state management
  - _Requirements: 2.1, 2.2, 2.6_

- [x] 12. Refactor home page with improved component structure
  - Extract PokemonGrid component for better separation of concerns
  - Implement proper state management using React hooks
  - Add modal state management and pokemon selection logic
  - Integrate delete functionality with optimistic updates
  - _Requirements: 3.1, 3.2, 3.3, 3.4_

- [x] 13. Add API hooks for pokemon detail and delete operations
  - Create useApiQuery hook for individual pokemon with moves
  - Create useApiMutation hook for pokemon deletion
  - Implement proper error handling and loading states
  - Add React Query cache invalidation for delete operations
  - _Requirements: 2.1, 4.4, 4.5_

- [x] 14. Implement admin authorization and UI conditional rendering
  - Add admin status check in authentication hook
  - Implement conditional delete button rendering based on admin status
  - Add proper authorization headers for delete API calls
  - Create admin-only UI indicators and feedback
  - _Requirements: 4.2, 4.3, 4.5_

- [x] 15. Add comprehensive error handling and loading states
  - Implement error boundaries for component error handling
  - Add loading skeletons for modal and table components
  - Create user-friendly error messages and retry mechanisms
  - Add success/error toast notifications for user actions
  - _Requirements: 5.1, 5.2, 5.3_

- [x] 16. Polish user experience and responsive design
  - Ensure modal responsiveness across different screen sizes
  - Add smooth transitions and animations for user interactions
  - Implement proper focus management for accessibility
  - Add consistent styling and visual feedback throughout the application
  - _Requirements: 5.1, 5.4, 5.5_

- [ ] 17. Write comprehensive tests for new functionality
  - Create unit tests for new repository methods
  - Write component tests for modal and table components
  - Add integration tests for API endpoints
  - Implement end-to-end tests for complete user workflows
  - _Requirements: All requirements validation_
