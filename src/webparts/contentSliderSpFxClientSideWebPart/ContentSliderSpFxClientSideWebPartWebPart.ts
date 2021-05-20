/* 
  WORKBENCH URL: https://bksdevsite.sharepoint.com/_layouts/15/workbench.aspx 
*/

//#region [imports]

  import * as React from 'react';
  import * as ReactDom from 'react-dom';
  import { Version } from '@microsoft/sp-core-library';
  import { IPropertyPaneConfiguration, PropertyPaneTextField } from '@microsoft/sp-property-pane';
  import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
  import * as strings from 'ContentSliderSpFxClientSideWebPartWebPartStrings';
  import ContentSliderSpFxClientSideWebPart from './components/ContentSliderSpFxClientSideWebPart';
  import { IContentSliderSpFxClientSideWebPartProps } from './components/IContentSliderSpFxClientSideWebPartProps';

//#endregion

export interface IContentSliderSpFxClientSideWebPartWebPartProps {
  description: string;
}

export default class ContentSliderSpFxClientSideWebPartWebPart 
  extends BaseClientSideWebPart<IContentSliderSpFxClientSideWebPartWebPartProps> {

  //#region [render]

    public render(): void {
      const element: React.ReactElement<IContentSliderSpFxClientSideWebPartProps> = React.createElement(
        ContentSliderSpFxClientSideWebPart,
        {
          description: this.properties.description,
          gThis: this
        }
      );
      ReactDom.render(element, this.domElement);
    }

  //#endregion

  //#region [GenericCode]
  
    protected onDispose(): void {
      ReactDom.unmountComponentAtNode(this.domElement);
    }

    protected get dataVersion(): Version {
      return Version.parse('1.0');
    }

    protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
      return {
        pages: [
          {
            header: {
              description: strings.PropertyPaneDescription
            },
            groups: [
              {
                groupName: strings.BasicGroupName,
                groupFields: [
                  PropertyPaneTextField('description', {
                    label: strings.DescriptionFieldLabel
                  })
                ]
              }
            ]
          }
        ]
      };
    }

  //#endregion

}