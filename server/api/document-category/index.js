import {Router} from 'express';
import * as controller from './document-category.controller';
import {isAuthenticated} from '../../auth/auth.service';
import multer from 'multer';

var storage = multer.memoryStorage();
var upload = multer({ storage: storage });
var router = new Router();

router.post('/', controller.createNewDocumentCategory);
router.get('/', controller.showDocumentCategories);

router.get('/unclassifiedCategory', controller.getUnclassifiedCategory);

router.post('/document-types', controller.updateDocumentType);
router.get('/document-types', controller.showUncategorizedDocumentTypes);

//router.put('/', isAuthenticated(), controller.updateDocumentCategories);

// router.put('/:categoryId', isAuthenticated(), controller.updateDocumentCategory);
// router.delete('/:categoryId', isAuthenticated(), controller.removeDocumentCategory);
//
// router.post('/:categoryId/file', isAuthenticated(), upload.single('file'), controller.saveDocumentCategoryFile);
// router.get('/:categoryId/file', isAuthenticated(), controller.getDocumentCategoryFile);

// router.post('/:categoryId/moveDocument/:newCategoryId', isAuthenticated(), controller.updateDocument);

export default router;
