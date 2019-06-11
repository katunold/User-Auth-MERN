import User from '../models/user.model';
import _ from 'lodash';
import errorHandler from './../helpers/dbErrorHandler';

const create = (req, res, next) => {};
const list = (req, res) => {};
const userByID = (req, res, next, id) => {};
const read = (req, res) => {};
const update = (req, res, next) => {};
const remove = (req, res, next) => {};

export default { create, userByID, read, list, remove, update }
