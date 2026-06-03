import { BriefcaseBusiness } from 'lucide-react';
import type { ComponentProps } from 'react';

export default function AppLogoIcon(
    props: ComponentProps<typeof BriefcaseBusiness>,
) {
    return <BriefcaseBusiness aria-hidden="true" {...props} />;
}
