import PageHeader from '../Elements/PageHeader';
import { ArrowRight } from 'lucide-react';
import Card from '../Fragments/Card';

const SelectedWorks = () => {
  return (
    <div className="flex justify-center mt-10">
      <div className="container">
        <div className="flex justify-between">
          <PageHeader eyebrow={'CASE STUDIES'} title={'Selected Works'} />
          <div className="flex justify-end flex-col pb-3">
            <span className="flex gap-2 text-primary">
              All Projects <ArrowRight />
            </span>
          </div>
        </div>
        <div className="flex flex-row">
          <Card
            title={'Nebula Cloud Engine'}
            tag={['React', 'Java', 'Jawa']}
            image={'./jpg1.jpg'}
          />
          <Card
            title={'Nebula Cloud Engine'}
            tag={['React', 'Java', 'Jawa']}
            desc={
              'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Cupiditate fugit earum exercitationem sapiente accusamus, animi saepe reiciendis ab distinctio deleniti beatae consequatur pariatur qui laborum, libero alias provident, porro error?'
            }
            image={'./jpg1.jpg'}
          />
        </div>
      </div>
    </div>
  );
};

export default SelectedWorks;
