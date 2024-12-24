const { updatePage, createPage } = require('./lesson-pages');
const { updateLesson, createLesson } = require('./lessons');

export const handleByContentType = async ({ contentType = '', parent = null, content = null, isEdit = false }) => {
  if (contentType === 'lesson') {
    if (isEdit) {
      await updateLesson(content?.id, { name: newName });
    } else {
      await createLesson({ name: newName, courseId: parent?.id });
    }
  } else if (contentType === 'page') {
    if (isEdit) {
      await updatePage(content?.id, { name: newName });
    } else {
      await createPage({ name: newName, lessonId: parent?.id });
    }
  }
};
