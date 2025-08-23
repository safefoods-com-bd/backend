import blogRoutes from "./routes/blogs.routes";
import { listAllBlogsV100 } from "./controllers/list-all-blogs.controller";
import { getSingleBlogV100 } from "./controllers/get-single-blog.controller";
import { createBlogV100 } from "./controllers/create-blog.controller";
import { updateBlogV100 } from "./controllers/update-blog.controller";
import {
  deleteBlogV100,
  deleteBlogsBatchV100,
} from "./controllers/delete-blog.controller";
import {
  blogValidationSchema,
  updateBlogValidationSchema,
  deleteBlogValidationSchema,
  deleteBlogsBatchValidationSchema,
} from "./validations/blogs.validation";

export {
  blogRoutes,
  listAllBlogsV100,
  getSingleBlogV100,
  createBlogV100,
  updateBlogV100,
  deleteBlogV100,
  deleteBlogsBatchV100,
  blogValidationSchema,
  updateBlogValidationSchema,
  deleteBlogValidationSchema,
  deleteBlogsBatchValidationSchema,
};
