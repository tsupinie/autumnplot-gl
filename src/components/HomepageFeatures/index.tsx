import type {ReactNode} from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
    title: string;
    Svg: React.ComponentType<React.ComponentProps<'svg'>>;
    description: ReactNode;
};

const FeatureList: FeatureItem[] = [
    {
        title: 'Easy to Use',
        Svg: require('@site/static/img/visualize.svg').default,
        description: (
            <>
                Create rich data visualizations on a fully interactive map with just a few lines of code.
            </>
        ),
    },
    {
        title: 'Designed with Performance in Mind',
        Svg: require('@site/static/img/accelerated.svg').default,
        description: (
            <>
                GPU-accelerated for responsive applications even with large datasets.
            </>
        ),
    },
    {
        title: 'Choose From Many Plot Types',
        Svg: require('@site/static/img/plot_types.svg').default,
        description: (
            <>
                Common plot types in meteorological data visualization, such as contours and wind barbs, are included.
            </>
        ),
    },
];

function Feature({title, Svg, description}: FeatureItem) {
    return (
        <div className={clsx('col col--4')}>
            <div className="text--center">
                <Svg className={styles.featureSvg} role="img" />
            </div>
            <div className="text--center padding-horiz--md">
                <Heading as="h3">{title}</Heading>
                <p>{description}</p>
            </div>
        </div>
    );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
