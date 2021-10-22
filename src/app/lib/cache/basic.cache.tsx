interface CreateCacheModifierProps {
  cache: any;
  createdDoc: any;
  fragment: any,
  fragmentName: string;
  modelName: string;
  append?: boolean;
}

export const createCacheModifier = ({ cache, createdDoc, fragment, modelName, fragmentName, append = false }: CreateCacheModifierProps) =>
  (existingRefs = [], { readField }: any) => {
    const createdDocs = Array.isArray(createdDoc) ? createdDoc : [createdDoc];
    const nextResult: any[] = [...existingRefs];

    createdDocs.forEach(currDoc => {
      const createdRef = cache.writeFragment({
        id: `${modelName}:${currDoc._id}`,
        data: currDoc,
        fragment,
        fragmentName
      });

      if (!existingRefs.some(ref => readField('_id', ref) === currDoc._id)) {
        if (append) {
          nextResult.push(createdRef);
        } else {
          nextResult.unshift(createdRef);
        }
      }
    });

    return nextResult;
  };

export const removeCacheModifier = (cache: any, _id: string) =>
  (existingRefs = [], { readField }: any) => {
    return existingRefs.filter(ref => _id !== readField('_id', ref));
  };
