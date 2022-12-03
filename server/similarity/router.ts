import type {Request, Response} from 'express';
import express from 'express';
import SimilarityScoreCollection from './collection';
import * as userValidator from '../user/middleware';
import * as util from './util';


const router = express.Router();

/**
 * Attempts to update/create all pairings of logged in user
 */
router.post(
  '/',
  [
    userValidator.isUserLoggedIn,
  ],
  async (req: Request, res: Response) => {
    const updated = await SimilarityScoreCollection.updatePairings(req.session.userId);

    if (updated) {
      res.status(201).json({
        message: `Your similarity scores were created/updated successfully.`,
        updated: updated
      });
    }
  }
);

/**
 * Attempts to get all pairings of logged in user
 */
 router.get(
  '/',
  [
    userValidator.isUserLoggedIn,
  ],
  async (req: Request, res: Response) => {
    const similarities = await SimilarityScoreCollection.find(req.session.userId);
    const response = similarities.map(util.constructSimilarityScoreResponse);

    res.status(200).json(response);
  }
);

/**
 * Attempts to delete all pairings of logged in user (before deleting their account)
 */
 router.delete(
  '/',
  [
    userValidator.isUserLoggedIn,
  ],
  async (req: Request, res: Response) => {
    const deleted = await SimilarityScoreCollection.deletePairings(req.session.userId);

    res.status(201).json({
      message: `Your similarity scores were deleted successfully.`,
      deleted: deleted
    });
  }
);

export {router as similarityRouter};