import { ICommentWithAuthor } from "@/app/api/comments/route";
import { getComments } from "@/app/lib/data";
import {
  Box,
  Typography,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from "@mui/material";
import AddComment from "./addComment";

const CommentSection = async ({ blogId }: { blogId: string }) => {
  // const fetchComments = async () => {
  const comments: ICommentWithAuthor[] = await getComments(blogId);
  console.log(comments);

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" gutterBottom>
        Comments ({comments.length})
      </Typography>

      <List>
        <AddComment blogId={blogId} />
        {comments.map((comment) => (
          <ListItem key={comment._id.toString()} alignItems="flex-start">
            <ListItemAvatar>
              <Avatar src={comment.authorDetails.profilePicture}>
                {comment.authorDetails.firstName}
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={comment.authorDetails.firstName}
              secondary={
                <>
                  <Typography
                    component="span"
                    variant="body2"
                    color="text.primary"
                  >
                    {comment.content}
                  </Typography>
                  <Typography variant="caption" display="block">
                    {new Date(comment.createdAt).toLocaleString()}
                  </Typography>
                </>
              }
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};
export default CommentSection;
